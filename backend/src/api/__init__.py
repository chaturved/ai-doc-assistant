from fastapi import APIRouter
from ..api import v1, internal

router = APIRouter()

router.include_router(v1.router)
router.include_router(internal.router)

