import json
from fastapi import APIRouter, BackgroundTasks, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from src.database.db import get_db
from src.schemas.query import QuerySearchRequest
from src.services.auth_service import get_current_user_id
from src.services.query_service import ask_question

router = APIRouter(prefix="/query", tags=["Query"])

@router.post("/ask")
async def ask(
    query: QuerySearchRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    async def streamer():
        try:
            async for event_type, data in ask_question(db, user_id, query, background_tasks):
                if event_type == "meta":
                    yield f"data: {json.dumps({'meta': data})}\n\n"
                elif event_type == "token":
                    yield f"data: {json.dumps({'token': data})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"event: error\ndata: {json.dumps({'message': str(e)})}\n\n"

    return StreamingResponse(streamer(), media_type="text/event-stream")
