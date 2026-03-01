from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

from .config import SETTINGS
from .db import DB, now_iso
from .legacy_mvp import app as legacy_mvp_app
from .routers import auth_router, participant_router, researcher_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    DB.init()
    yield


def create_app() -> FastAPI:
    app = FastAPI(title=SETTINGS.app_name, version=SETTINGS.app_version, lifespan=lifespan)
    app.mount("/static", StaticFiles(directory=str(SETTINGS.base_dir / "static")), name="static")

    app.include_router(auth_router)
    app.include_router(researcher_router)
    app.include_router(participant_router)
    app.mount("/legacy-mvp", legacy_mvp_app)

    @app.get("/")
    async def root_redirect():
        return RedirectResponse(url="/researcher", status_code=302)

    @app.get("/researcher")
    async def researcher_page():
        return FileResponse(str(SETTINGS.base_dir / "static" / "researcher.html"))

    @app.get("/legacy")
    async def legacy_page():
        return RedirectResponse(url="/legacy-mvp/", status_code=302)

    @app.get("/participant/{invite_code}")
    async def participant_page(invite_code: str):
        # invite_code consumed by frontend from path.
        return FileResponse(str(SETTINGS.base_dir / "static" / "participant.html"))

    @app.get("/healthz")
    async def healthz():
        return {"ok": True, "ts": now_iso(), "db": str(SETTINGS.db_path)}

    return app
