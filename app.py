from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).resolve().parent
GUIDE_ROUTE = "/guides/yunnan"
GUIDE_FILE = BASE_DIR / "static" / "guide" / "yunnan.html"


def create_app() -> FastAPI:
    app = FastAPI(title="Trip Hub", version="1.0.0")
    app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")

    @app.get("/", include_in_schema=False)
    async def root_redirect():
        return RedirectResponse(url=GUIDE_ROUTE, status_code=302)

    @app.get(GUIDE_ROUTE, include_in_schema=False)
    async def yunnan_guide():
        return FileResponse(str(GUIDE_FILE))

    @app.get("/healthz")
    async def healthz():
        return {
            "ok": True,
            "route": GUIDE_ROUTE,
            "page": str(GUIDE_FILE.relative_to(BASE_DIR)),
        }

    return app


app = create_app()
