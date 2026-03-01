import json
import sqlite3
import uuid
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

from .config import SETTINGS


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class Database:
    def __init__(self, db_path: Path) -> None:
        self.db_path = str(db_path)

    def connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        conn.execute("PRAGMA journal_mode = WAL;")
        return conn

    @contextmanager
    def session(self) -> Iterable[sqlite3.Connection]:
        conn = self.connect()
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    def init(self) -> None:
        with self.session() as conn:
            conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS users (
                  id TEXT PRIMARY KEY,
                  email TEXT UNIQUE NOT NULL,
                  password_hash TEXT NOT NULL,
                  role TEXT NOT NULL DEFAULT 'researcher',
                  created_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS researcher_sessions (
                  id TEXT PRIMARY KEY,
                  user_id TEXT NOT NULL,
                  session_token TEXT UNIQUE NOT NULL,
                  created_at TEXT NOT NULL,
                  expires_at TEXT NOT NULL,
                  last_seen_at TEXT NOT NULL,
                  FOREIGN KEY(user_id) REFERENCES users(id)
                );

                CREATE TABLE IF NOT EXISTS projects (
                  id TEXT PRIMARY KEY,
                  owner_user_id TEXT NOT NULL,
                  title TEXT NOT NULL,
                  invitation_text TEXT NOT NULL,
                  template_json TEXT NOT NULL,
                  created_at TEXT NOT NULL,
                  updated_at TEXT NOT NULL,
                  FOREIGN KEY(owner_user_id) REFERENCES users(id)
                );

                CREATE TABLE IF NOT EXISTS invite_links (
                  id TEXT PRIMARY KEY,
                  project_id TEXT NOT NULL,
                  invite_code TEXT UNIQUE NOT NULL,
                  status TEXT NOT NULL DEFAULT 'active',
                  created_at TEXT NOT NULL,
                  expires_at TEXT,
                  FOREIGN KEY(project_id) REFERENCES projects(id)
                );

                CREATE TABLE IF NOT EXISTS interview_sessions (
                  id TEXT PRIMARY KEY,
                  project_id TEXT NOT NULL,
                  invite_id TEXT NOT NULL,
                  participant_token TEXT UNIQUE NOT NULL,
                  stage TEXT NOT NULL,
                  progress_json TEXT NOT NULL,
                  consented_at TEXT,
                  withdrawn_at TEXT,
                  summary_text TEXT,
                  created_at TEXT NOT NULL,
                  updated_at TEXT NOT NULL,
                  FOREIGN KEY(project_id) REFERENCES projects(id),
                  FOREIGN KEY(invite_id) REFERENCES invite_links(id)
                );

                CREATE TABLE IF NOT EXISTS messages (
                  id TEXT PRIMARY KEY,
                  session_id TEXT NOT NULL,
                  role TEXT NOT NULL,
                  content TEXT NOT NULL,
                  meta_json TEXT,
                  created_at TEXT NOT NULL,
                  FOREIGN KEY(session_id) REFERENCES interview_sessions(id)
                );

                CREATE TABLE IF NOT EXISTS audit_events (
                  id TEXT PRIMARY KEY,
                  project_id TEXT,
                  session_id TEXT,
                  actor_type TEXT NOT NULL,
                  actor_id TEXT,
                  event_type TEXT NOT NULL,
                  payload_json TEXT,
                  created_at TEXT NOT NULL
                );
                """
            )
            # Backward-compatible migrations for legacy MVP tables.
            self._ensure_column(conn, "messages", "session_id", "TEXT")
            self._ensure_column(conn, "messages", "meta_json", "TEXT")
            self._ensure_column(conn, "audit_events", "project_id", "TEXT")
            self._ensure_column(conn, "audit_events", "session_id", "TEXT")
            self._ensure_column(conn, "audit_events", "actor_type", "TEXT")
            self._ensure_column(conn, "audit_events", "actor_id", "TEXT")

            # Safe index creation after columns are guaranteed.
            self._safe_create_index(conn, "idx_project_owner", "projects(owner_user_id)")
            self._safe_create_index(conn, "idx_invite_project", "invite_links(project_id)")
            self._safe_create_index(conn, "idx_session_project", "interview_sessions(project_id)")
            self._safe_create_index(conn, "idx_message_session_time", "messages(session_id, created_at)")
            self._safe_create_index(conn, "idx_audit_project_time", "audit_events(project_id, created_at)")

    @staticmethod
    def _table_columns(conn: sqlite3.Connection, table: str) -> set[str]:
        try:
            rows = conn.execute(f"PRAGMA table_info({table})").fetchall()
        except Exception:
            return set()
        return {str(r["name"]) for r in rows}

    @staticmethod
    def _ensure_column(conn: sqlite3.Connection, table: str, column: str, ddl: str) -> None:
        cols = Database._table_columns(conn, table)
        if column in cols:
            return
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {ddl}")

    @staticmethod
    def _safe_create_index(conn: sqlite3.Connection, index_name: str, expr: str) -> None:
        conn.execute(f"CREATE INDEX IF NOT EXISTS {index_name} ON {expr}")

    @staticmethod
    def uuid() -> str:
        return str(uuid.uuid4())

    @staticmethod
    def row_to_dict(row: Optional[sqlite3.Row]) -> Optional[Dict[str, Any]]:
        return dict(row) if row else None

    @staticmethod
    def rows_to_dicts(rows: List[sqlite3.Row]) -> List[Dict[str, Any]]:
        return [dict(r) for r in rows]

    def add_audit(
        self,
        *,
        project_id: Optional[str],
        session_id: Optional[str],
        actor_type: str,
        actor_id: Optional[str],
        event_type: str,
        payload: Optional[Dict[str, Any]] = None,
    ) -> None:
        with self.session() as conn:
            conn.execute(
                """
                INSERT INTO audit_events (id, project_id, session_id, actor_type, actor_id, event_type, payload_json, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    self.uuid(),
                    project_id,
                    session_id,
                    actor_type,
                    actor_id,
                    event_type,
                    json.dumps(payload or {}, ensure_ascii=False),
                    now_iso(),
                ),
            )


DB = Database(SETTINGS.db_path)
