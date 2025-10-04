from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from src.database.db import get_db
from src.schemas.query import QuerySearchRequest
from src.services.auth_service import get_current_user_id
from src.services.query_service import search_documents, get_recent_queries, get_related_queries, get_search_tips

router = APIRouter(prefix="/query", tags=["Query"])

@router.get("/search")
def search(
    request: QuerySearchRequest,
    db: Session = Depends(get_db), 
    user_id: int = Depends(get_current_user_id)
):
    return search_documents(db, user_id, request)


@router.get("/recent")
def recent(
    limit: int = 5, 
    db: Session = Depends(get_db), 
    user_id: int = Depends(get_current_user_id)
):
    return get_recent_queries(db, user_id, limit)


@router.get("/related")
def related(
    query: str = Query(..., min_length=1), 
    top_k: int = 5,
    db: Session = Depends(get_db), 
    user_id: int = Depends(get_current_user_id)
):
    return get_related_queries(db, user_id, query, top_k)


@router.get("/tips")
def tips():
    return get_search_tips()
