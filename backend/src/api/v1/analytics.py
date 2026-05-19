from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.core.dependencies import get_current_user_id, get_db
from src.repositories import analytics_repository

router = APIRouter(prefix="/analytics", tags=["Analytics"])


class FeedbackBody(BaseModel):
    value: str  # 'up' | 'down'


@router.get("/overview")
def overview(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return analytics_repository.get_overview(db, user_id)


@router.get("/queries")
def query_volume(
    days: int = 30,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return analytics_repository.get_query_volume(db, user_id, days)


@router.get("/citations")
def top_citations(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return analytics_repository.get_top_cited_docs(db, user_id)


@router.post("/messages/{message_id}/feedback")
def set_feedback(
    message_id: int,
    body: FeedbackBody,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    if body.value not in ("up", "down"):
        raise HTTPException(status_code=422, detail="value must be 'up' or 'down'")
    return analytics_repository.upsert_feedback(db, message_id, user_id, body.value)


@router.get("/messages/feedbacks")
def get_feedbacks(
    message_ids: str,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    ids = [int(i) for i in message_ids.split(",") if i.strip().isdigit()]
    return analytics_repository.get_user_feedbacks(db, user_id, ids)
