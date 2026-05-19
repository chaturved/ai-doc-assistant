import json
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from src.core.dependencies import get_current_user_id, get_db
from src.schemas.conversation import AskRequest, ConversationCreate, ConversationRename
from src.services.conversation_service import (
    ask,
    list_conversations,
    list_messages,
    new_conversation,
    remove_conversation,
    rename_conversation,
)

router = APIRouter(prefix="/conversations", tags=["Conversations"])


@router.get("")
def get_conversations(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return list_conversations(db, user_id)


@router.post("")
def create_conversation(
    body: ConversationCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return new_conversation(db, user_id, body.title)


@router.patch("/{conv_id}")
def rename(
    conv_id: int,
    body: ConversationRename,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return rename_conversation(db, conv_id, user_id, body.title)


@router.delete("/{conv_id}")
def delete(conv_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return remove_conversation(db, conv_id, user_id)


@router.get("/{conv_id}/messages")
def messages(conv_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return list_messages(db, conv_id, user_id)


@router.post("/{conv_id}/ask")
async def ask_question(
    conv_id: int,
    body: AskRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    async def streamer():
        try:
            async for event_type, data in ask(db, conv_id, user_id, body.question, body.filters, body.top_k):
                if event_type == "meta":
                    yield f"data: {json.dumps({'meta': data})}\n\n"
                elif event_type == "token":
                    yield f"data: {json.dumps({'token': data})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"event: error\ndata: {json.dumps({'message': str(e)})}\n\n"

    return StreamingResponse(streamer(), media_type="text/event-stream")
