from fastapi import APIRouter, Depends

from src.core.dependencies import get_waitlist_service
from src.schemas.user import WaitlistRequest
from src.services.waitlist_service import WaitlistServiceProtocol

router = APIRouter(tags=["Misc"])


@router.post("/waitlist")
def join_waitlist(body: WaitlistRequest, service: WaitlistServiceProtocol = Depends(get_waitlist_service)):
    return service.join(body.email)
