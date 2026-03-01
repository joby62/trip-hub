import json
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple

from fastapi import HTTPException

from ..config import SETTINGS
from ..db import DB, now_iso
from ..llm import LLM
from ..prompts import ACTIVE_STAGES, DEFAULT_TEMPLATE, TEMPLATE_SCHEMA, TEMPLATE_SYSTEM_PROMPT
from ..security import hash_password, new_token, verify_password


def _parse_json(text: str, fallback: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    try:
        return json.loads(text or "{}")
    except Exception:
        return fallback or {}


def _normalize_template(raw: Dict[str, Any]) -> Dict[str, Any]:
    if not isinstance(raw, dict):
        return DEFAULT_TEMPLATE

    opening_script = str(raw.get("opening_script") or DEFAULT_TEMPLATE["opening_script"]).strip()
    raw_stages = raw.get("stages") if isinstance(raw.get("stages"), list) else []

    normalized: List[Dict[str, Any]] = []
    default_stage_map = {s["key"]: s for s in DEFAULT_TEMPLATE["stages"]}

    by_key = {}
    for stage in raw_stages:
        if not isinstance(stage, dict):
            continue
        key = str(stage.get("key") or "").strip()
        if key in ACTIVE_STAGES:
            by_key[key] = stage

    for key in ACTIVE_STAGES:
        base = default_stage_map[key]
        src = by_key.get(key, {})
        hints = src.get("prompt_hints") if isinstance(src.get("prompt_hints"), list) else base["prompt_hints"]
        hints = [str(h).strip() for h in hints if str(h).strip()][:4]
        if len(hints) < 2:
            hints = base["prompt_hints"]

        min_turns = src.get("min_turns", base["min_turns"])
        min_chars = src.get("min_chars", base["min_chars"])
        try:
            min_turns = max(1, min(4, int(min_turns)))
        except Exception:
            min_turns = base["min_turns"]
        try:
            min_chars = max(20, min(120, int(min_chars)))
        except Exception:
            min_chars = base["min_chars"]

        normalized.append(
            {
                "key": key,
                "title": str(src.get("title") or base["title"]).strip(),
                "goal": str(src.get("goal") or base["goal"]).strip(),
                "prompt_hints": hints,
                "min_turns": min_turns,
                "min_chars": min_chars,
            }
        )

    return {
        "opening_script": opening_script,
        "stages": normalized,
    }


def _make_invite_code() -> str:
    return secrets.token_urlsafe(9).replace("-", "").replace("_", "")[:12]


def register_researcher(email: str, password: str) -> Dict[str, Any]:
    email = email.strip().lower()
    if "@" not in email:
        raise HTTPException(status_code=400, detail="请输入有效邮箱")
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="密码至少 8 位")

    with DB.session() as conn:
        exists = conn.execute("SELECT id FROM users WHERE email=?", (email,)).fetchone()
        if exists:
            raise HTTPException(status_code=409, detail="该邮箱已注册")

        user_id = DB.uuid()
        conn.execute(
            "INSERT INTO users (id, email, password_hash, role, created_at) VALUES (?, ?, ?, 'researcher', ?)",
            (user_id, email, hash_password(password), now_iso()),
        )

    DB.add_audit(
        project_id=None,
        session_id=None,
        actor_type="researcher",
        actor_id=user_id,
        event_type="researcher_registered",
        payload={"email": email},
    )
    return {"id": user_id, "email": email}


def create_researcher_session(email: str, password: str) -> Tuple[Dict[str, Any], str, str]:
    email = email.strip().lower()
    with DB.session() as conn:
        user = conn.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
        if not user:
            raise HTTPException(status_code=401, detail="账号或密码错误")
        if not verify_password(password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="账号或密码错误")

        token = new_token(24)
        created = now_iso()
        expires_dt = datetime.now(timezone.utc) + timedelta(hours=SETTINGS.researcher_session_hours)
        expires_at = expires_dt.isoformat()

        conn.execute(
            """
            INSERT INTO researcher_sessions (id, user_id, session_token, created_at, expires_at, last_seen_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (DB.uuid(), user["id"], token, created, expires_at, created),
        )

    DB.add_audit(
        project_id=None,
        session_id=None,
        actor_type="researcher",
        actor_id=user["id"],
        event_type="researcher_login",
        payload={"email": email},
    )
    return {"id": user["id"], "email": user["email"]}, token, expires_at


def get_researcher_by_session(token: str) -> Optional[Dict[str, Any]]:
    if not token:
        return None

    with DB.session() as conn:
        row = conn.execute(
            """
            SELECT u.id, u.email, rs.id AS session_id, rs.expires_at
            FROM researcher_sessions rs
            JOIN users u ON u.id = rs.user_id
            WHERE rs.session_token=?
            """,
            (token,),
        ).fetchone()
        if not row:
            return None

        expires_at = row["expires_at"]
        try:
            if datetime.fromisoformat(expires_at) < datetime.now(timezone.utc):
                conn.execute("DELETE FROM researcher_sessions WHERE id=?", (row["session_id"],))
                return None
        except Exception:
            return None

        conn.execute("UPDATE researcher_sessions SET last_seen_at=? WHERE id=?", (now_iso(), row["session_id"]))

    return {"id": row["id"], "email": row["email"]}


def delete_researcher_session(token: str) -> None:
    if not token:
        return
    with DB.session() as conn:
        conn.execute("DELETE FROM researcher_sessions WHERE session_token=?", (token,))


def _generate_template(invitation_text: str) -> Dict[str, Any]:
    invitation_text = invitation_text.strip()
    if not invitation_text:
        return DEFAULT_TEMPLATE

    user_payload = json.dumps(
        {
            "invitation_text": invitation_text,
            "requirements": {
                "stages_order": ACTIVE_STAGES,
                "target": "以邀请函为核心诉求，帮助受访者产出可用自传素材",
            },
        },
        ensure_ascii=False,
    )

    try:
        raw = LLM.json(
            system_prompt=TEMPLATE_SYSTEM_PROMPT,
            user_text=user_payload,
            schema=TEMPLATE_SCHEMA,
            model=SETTINGS.default_model,
        )
    except Exception:
        return DEFAULT_TEMPLATE

    return _normalize_template(raw)


def create_project(owner_user_id: str, title: str, invitation_text: str) -> Dict[str, Any]:
    title = (title or "").strip() or "未命名访谈项目"
    invitation_text = (invitation_text or "").strip()
    if not invitation_text:
        raise HTTPException(status_code=400, detail="请填写邀请函内容")

    template = _generate_template(invitation_text)
    project_id = DB.uuid()
    invite_id = DB.uuid()

    invite_code = _make_invite_code()
    created_at = now_iso()

    with DB.session() as conn:
        conn.execute(
            """
            INSERT INTO projects (id, owner_user_id, title, invitation_text, template_json, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (project_id, owner_user_id, title, invitation_text, json.dumps(template, ensure_ascii=False), created_at, created_at),
        )
        conn.execute(
            """
            INSERT INTO invite_links (id, project_id, invite_code, status, created_at, expires_at)
            VALUES (?, ?, ?, 'active', ?, NULL)
            """,
            (invite_id, project_id, invite_code, created_at),
        )

    DB.add_audit(
        project_id=project_id,
        session_id=None,
        actor_type="researcher",
        actor_id=owner_user_id,
        event_type="project_created",
        payload={"title": title, "invite_code": invite_code},
    )

    return {
        "id": project_id,
        "title": title,
        "invitation_text": invitation_text,
        "template": template,
        "invite_code": invite_code,
        "created_at": created_at,
    }


def list_projects(owner_user_id: str) -> List[Dict[str, Any]]:
    with DB.session() as conn:
        rows = conn.execute(
            """
            SELECT p.id, p.title, p.created_at, p.updated_at,
                   l.invite_code,
                   COUNT(DISTINCT s.id) AS sessions_count
            FROM projects p
            LEFT JOIN invite_links l ON l.project_id = p.id AND l.status='active'
            LEFT JOIN interview_sessions s ON s.project_id = p.id
            WHERE p.owner_user_id=?
            GROUP BY p.id, p.title, p.created_at, p.updated_at, l.invite_code
            ORDER BY p.updated_at DESC
            """,
            (owner_user_id,),
        ).fetchall()
    return [dict(r) for r in rows]


def get_project_detail(owner_user_id: str, project_id: str) -> Dict[str, Any]:
    with DB.session() as conn:
        p = conn.execute(
            """
            SELECT p.*, l.invite_code
            FROM projects p
            LEFT JOIN invite_links l ON l.project_id = p.id AND l.status='active'
            WHERE p.id=? AND p.owner_user_id=?
            """,
            (project_id, owner_user_id),
        ).fetchone()
        if not p:
            raise HTTPException(status_code=404, detail="项目不存在")

        sessions = conn.execute(
            """
            SELECT s.id, s.stage, s.consented_at, s.withdrawn_at, s.created_at, s.updated_at,
                   COUNT(m.id) AS message_count
            FROM interview_sessions s
            LEFT JOIN messages m ON m.session_id = s.id
            WHERE s.project_id=?
            GROUP BY s.id
            ORDER BY s.updated_at DESC
            """,
            (project_id,),
        ).fetchall()

    data = dict(p)
    data["template"] = _parse_json(data.get("template_json", "{}"), DEFAULT_TEMPLATE)
    data["sessions"] = [dict(r) for r in sessions]
    return data


def get_session_detail(owner_user_id: str, session_id: str) -> Dict[str, Any]:
    with DB.session() as conn:
        row = conn.execute(
            """
            SELECT s.*, p.id AS project_id, p.owner_user_id, p.title AS project_title
            FROM interview_sessions s
            JOIN projects p ON p.id = s.project_id
            WHERE s.id=?
            """,
            (session_id,),
        ).fetchone()
        if not row or row["owner_user_id"] != owner_user_id:
            raise HTTPException(status_code=404, detail="会话不存在")

        msgs = conn.execute(
            "SELECT role, content, meta_json, created_at FROM messages WHERE session_id=? ORDER BY created_at ASC",
            (session_id,),
        ).fetchall()

    out = dict(row)
    out["progress"] = _parse_json(out.get("progress_json", "{}"), {})
    out["messages"] = [dict(r) for r in msgs]
    return out


def export_session(owner_user_id: str, session_id: str, fmt: str = "json") -> Tuple[str, str]:
    detail = get_session_detail(owner_user_id, session_id)
    messages = detail.get("messages", [])

    if fmt == "txt":
        lines = [
            f"项目: {detail.get('project_title', '-')}",
            f"会话: {session_id}",
            f"阶段: {detail.get('stage', '-')}",
            "",
            "=== 对话记录 ===",
        ]
        for m in messages:
            lines.append(f"[{m.get('created_at','')}] {m.get('role','')}: {m.get('content','')}")
        lines.append("\n=== 总结 ===")
        lines.append(detail.get("summary_text") or "尚未生成总结")
        return "text/plain; charset=utf-8", "\n".join(lines)

    payload = {
        "session": {k: v for k, v in detail.items() if k != "messages"},
        "messages": messages,
    }
    return "application/json; charset=utf-8", json.dumps(payload, ensure_ascii=False, indent=2)
