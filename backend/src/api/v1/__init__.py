from fastapi import APIRouter
from ..v1 import auth, library, query

router = APIRouter(prefix="/api/v1")

router.include_router(auth.router)
router.include_router(library.router)
router.include_router(query.router)