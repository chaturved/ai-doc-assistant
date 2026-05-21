import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from src.core.dependencies import (
    get_conversation_service,
    get_current_user,
    get_current_user_id,
    get_db,
    get_tier_service,
)
from src.core.exceptions import NotFoundError
from src.models.conversation import Conversation
from src.models.user import User
from src.schemas.conversation import AskRequest, ConversationCreate, ConversationRename
from src.services.conversation_service import IConversationService
from src.services.tier_service import ITierService

router = APIRouter(prefix="/conversations", tags=["Conversations"])


@router.get("")
def get_conversations(
    user_id: int = Depends(get_current_user_id),
    service: IConversationService = Depends(get_conversation_service),
):
    return service.list_conversations(user_id)


@router.post("")
def create_conversation(
    body: ConversationCreate,
    user_id: int = Depends(get_current_user_id),
    service: IConversationService = Depends(get_conversation_service),
):
    return service.new_conversation(user_id, body.title)


@router.patch("/{conv_id}")
def rename(
    conv_id: int,
    body: ConversationRename,
    user_id: int = Depends(get_current_user_id),
    service: IConversationService = Depends(get_conversation_service),
):
    return service.rename_conversation(conv_id, user_id, body.title)


@router.delete("/{conv_id}")
def delete(
    conv_id: int,
    user_id: int = Depends(get_current_user_id),
    service: IConversationService = Depends(get_conversation_service),
):
    return service.remove_conversation(conv_id, user_id)


@router.get("/{conv_id}/messages")
def messages(
    conv_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    service: IConversationService = Depends(get_conversation_service),
    tier: ITierService = Depends(get_tier_service),
):
    conv = db.get(Conversation, conv_id)
    if conv is None or conv.user_id != user.id:
        raise NotFoundError("Conversation not found")
    age_days = (datetime.now(timezone.utc) - conv.created_at.replace(tzinfo=timezone.utc)).days
    tier.check_history(user.plan, age_days)
    return service.list_messages(conv_id, user.id)


@router.post("/{conv_id}/ask")
async def ask_question(
    conv_id: int,
    body: AskRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    service: IConversationService = Depends(get_conversation_service),
    tier: ITierService = Depends(get_tier_service),
):
    conv = db.get(Conversation, conv_id)
    if conv is None or conv.user_id != user.id:
        raise NotFoundError("Conversation not found")

    age_days = (datetime.now(timezone.utc) - conv.created_at.replace(tzinfo=timezone.utc)).days
    tier.check_history(user.plan, age_days)

    count = tier.count_queries_24h(user.id)
    tier.check_ask(user.plan, count)

    tier.log_query(user.id)

    async def streamer():
        try:
            async for event_type, data in service.ask(conv_id, user.id, body.question, body.filters, body.top_k):
                if event_type == "meta":
                    yield f"data: {json.dumps({'meta': data})}\n\n"
                elif event_type == "token":
                    yield f"data: {json.dumps({'token': data})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"event: error\ndata: {json.dumps({'message': str(e)})}\n\n"

    return StreamingResponse(streamer(), media_type="text/event-stream")
