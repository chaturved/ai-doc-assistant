from datetime import datetime
from pydantic import BaseModel
from typing import Any


class ConversationCreate(BaseModel):
    title: str = "New conversation"


class ConversationRename(BaseModel):
    title: str


class ConversationOut(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class MessageOut(BaseModel):
    id: int
    role: str
    content: str
    meta: Any = None
    created_at: datetime

    model_config = {"from_attributes": True}


class AskRequest(BaseModel):
    question: str
    filters: dict | None = None
    top_k: int = 5
