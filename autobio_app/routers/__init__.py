from .auth import router as auth_router
from .participant import router as participant_router
from .researcher import router as researcher_router

__all__ = ["auth_router", "participant_router", "researcher_router"]
