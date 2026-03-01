from fastapi import APIRouter, Cookie, HTTPException, Response
from pydantic import BaseModel

from ..config import SETTINGS
from ..services.participant import (
    advance_stage,
    generate_summary,
    get_participant_state,
    give_consent,
    join_or_resume,
    post_message,
)

router = APIRouter(prefix="/api/participant", tags=["participant"])


class JoinReq(BaseModel):
    invite_code: str


class ConsentReq(BaseModel):
    agreed: bool


class MessageReq(BaseModel):
    content: str


def _require_participant(token: str) -> str:
    if not token:
        raise HTTPException(status_code=401, detail="请先通过邀请链接进入")
    return token


@router.post("/join")
def join(
    req: JoinReq,
    response: Response,
    participant_cookie: str = Cookie(default="", alias=SETTINGS.cookie_participant),
):
    payload, token = join_or_resume(req.invite_code.strip(), participant_cookie)
    response.set_cookie(
        key=SETTINGS.cookie_participant,
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=120 * 24 * 60 * 60,
        path="/",
    )
    return {"ok": True, **payload}


@router.get("/state")
def state(participant_cookie: str = Cookie(default="", alias=SETTINGS.cookie_participant)):
    token = _require_participant(participant_cookie)
    return {"ok": True, **get_participant_state(token)}


@router.post("/consent")
def consent(req: ConsentReq, participant_cookie: str = Cookie(default="", alias=SETTINGS.cookie_participant)):
    token = _require_participant(participant_cookie)
    return {"ok": True, **give_consent(token, req.agreed)}


@router.post("/message")
def message(req: MessageReq, participant_cookie: str = Cookie(default="", alias=SETTINGS.cookie_participant)):
    token = _require_participant(participant_cookie)
    result = post_message(token, req.content)
    state_payload = get_participant_state(token)
    return {"ok": True, "result": result, **state_payload}


@router.post("/advance")
def advance(participant_cookie: str = Cookie(default="", alias=SETTINGS.cookie_participant)):
    token = _require_participant(participant_cookie)
    return {"ok": True, **advance_stage(token)}


@router.post("/summary")
def summary(participant_cookie: str = Cookie(default="", alias=SETTINGS.cookie_participant)):
    token = _require_participant(participant_cookie)
    return {"ok": True, **generate_summary(token)}
