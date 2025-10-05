from typing import AsyncGenerator
from fastapi import APIRouter, BackgroundTasks, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from src.database.db import get_db
from src.schemas.query import QuerySearchRequest
from src.services.auth_service import get_current_user_id
from src.services.query_service import search_documents

router = APIRouter(prefix="/query", tags=["Query"])

@router.get("/search")
def search(
    req: QuerySearchRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db), 
    user_id: int = Depends(get_current_user_id)
):
    async def streamer() -> AsyncGenerator[str, None]:
        async for token in search_documents(db, user_id, req, background_tasks):
            yield token
    
    return StreamingResponse(streamer(), media_type="text/event-stream")
