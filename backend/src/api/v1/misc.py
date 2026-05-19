from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.core.dependencies import get_db
from src.repositories.waitlist_repository import add_to_waitlist, email_on_waitlist
from src.schemas.user import WaitlistRequest

router = APIRouter(tags=["Misc"])


@router.post("/waitlist")
def join_waitlist(body: WaitlistRequest, db: Session = Depends(get_db)):
    if email_on_waitlist(db, body.email):
        return {"message": "You're already on the list!"}
    add_to_waitlist(db, body.email)
    return {"message": "You're on the list!"}
