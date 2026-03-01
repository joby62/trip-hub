from fastapi import APIRouter, Cookie, HTTPException, Response
from fastapi.responses import Response as FastAPIResponse
from pydantic import BaseModel

from ..config import SETTINGS
from ..services.researcher import (
    create_project,
    export_session,
    get_project_detail,
    get_researcher_by_session,
    get_session_detail,
    list_projects,
)

router = APIRouter(prefix="/api/researcher", tags=["researcher"])


class ProjectCreateReq(BaseModel):
    title: str
    invitation_text: str


def _require_researcher(token: str):
    user = get_researcher_by_session(token)
    if not user:
        raise HTTPException(status_code=401, detail="请先登录发起者账号")
    return user


@router.get("/projects")
def projects(researcher_cookie: str = Cookie(default="", alias=SETTINGS.cookie_researcher)):
    user = _require_researcher(researcher_cookie)
    return {"ok": True, "projects": list_projects(user["id"])}


@router.post("/projects")
def projects_create(req: ProjectCreateReq, researcher_cookie: str = Cookie(default="", alias=SETTINGS.cookie_researcher)):
    user = _require_researcher(researcher_cookie)
    project = create_project(user["id"], req.title, req.invitation_text)
    return {"ok": True, "project": project}


@router.get("/projects/{project_id}")
def project_detail(project_id: str, researcher_cookie: str = Cookie(default="", alias=SETTINGS.cookie_researcher)):
    user = _require_researcher(researcher_cookie)
    data = get_project_detail(user["id"], project_id)
    return {"ok": True, "project": data}


@router.get("/sessions/{session_id}")
def session_detail(session_id: str, researcher_cookie: str = Cookie(default="", alias=SETTINGS.cookie_researcher)):
    user = _require_researcher(researcher_cookie)
    detail = get_session_detail(user["id"], session_id)
    return {"ok": True, "session": detail}


@router.get("/sessions/{session_id}/export")
def session_export(
    session_id: str,
    fmt: str = "json",
    researcher_cookie: str = Cookie(default="", alias=SETTINGS.cookie_researcher),
):
    user = _require_researcher(researcher_cookie)
    if fmt not in {"json", "txt"}:
        raise HTTPException(status_code=400, detail="fmt 仅支持 json 或 txt")
    content_type, payload = export_session(user["id"], session_id, fmt=fmt)
    filename = f"session_{session_id}.{fmt}"
    return FastAPIResponse(
        content=payload,
        media_type=content_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
