from datetime import datetime, timezone

from fastapi import APIRouter, Cookie, HTTPException, Response
from pydantic import BaseModel

from ..config import SETTINGS
from ..services.researcher import (
    create_researcher_session,
    delete_researcher_session,
    get_researcher_by_session,
    register_researcher,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


class RegisterReq(BaseModel):
    email: str
    password: str


class LoginReq(BaseModel):
    email: str
    password: str


@router.post("/register")
def register(req: RegisterReq):
    user = register_researcher(req.email, req.password)
    return {"ok": True, "user": user}


@router.post("/login")
def login(req: LoginReq, response: Response):
    user, session_token, expires_at = create_researcher_session(req.email, req.password)
    exp_dt = datetime.fromisoformat(expires_at)
    max_age = max(60, int((exp_dt - datetime.now(timezone.utc)).total_seconds()))
    response.set_cookie(
        key=SETTINGS.cookie_researcher,
        value=session_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=max_age,
        path="/",
    )
    return {"ok": True, "user": user}


@router.post("/logout")
def logout(response: Response, researcher_cookie: str = Cookie(default="", alias=SETTINGS.cookie_researcher)):
    if researcher_cookie:
        delete_researcher_session(researcher_cookie)
    response.delete_cookie(key=SETTINGS.cookie_researcher, path="/")
    return {"ok": True}


@router.get("/me")
def me(researcher_cookie: str = Cookie(default="", alias=SETTINGS.cookie_researcher)):
    user = get_researcher_by_session(researcher_cookie)
    if not user:
        raise HTTPException(status_code=401, detail="未登录")
    return {"ok": True, "user": user}
