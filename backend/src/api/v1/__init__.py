from fastapi import APIRouter
from ..v1 import auth, library, conversations, users, misc

router = APIRouter(prefix="/api/v1")

router.include_router(auth.router)
router.include_router(library.router)
router.include_router(conversations.router)
router.include_router(users.router)
router.include_router(misc.router)
