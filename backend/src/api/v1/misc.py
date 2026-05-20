from fastapi import APIRouter, Depends

from src.core.dependencies import get_waitlist_service
from src.schemas.user import WaitlistRequest
from src.services.waitlist_service import IWaitlistService

router = APIRouter(tags=["Misc"])


@router.post("/waitlist")
def join_waitlist(body: WaitlistRequest, service: IWaitlistService = Depends(get_waitlist_service)):
    return service.join(body.email)
