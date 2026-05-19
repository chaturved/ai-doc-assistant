from sqlalchemy.orm import Session
from src.models.conversation import Conversation
from src.models.message import Message
from typing import Optional


def create_conversation(db: Session, user_id: int, title: str = "New conversation") -> Conversation:
    conv = Conversation(user_id=user_id, title=title)
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv


def get_conversations(db: Session, user_id: int) -> list[Conversation]:
    return (
        db.query(Conversation)
        .filter(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
        .all()
    )


def get_conversation(db: Session, conv_id: int, user_id: int) -> Optional[Conversation]:
    return (
        db.query(Conversation)
        .filter(Conversation.id == conv_id, Conversation.user_id == user_id)
        .first()
    )


def update_conversation_title(db: Session, conv: Conversation, title: str) -> Conversation:
    conv.title = title
    db.commit()
    db.refresh(conv)
    return conv


def touch_conversation(db: Session, conv: Conversation) -> None:
    from sqlalchemy import func
    conv.updated_at = func.now()
    db.commit()


def delete_conversation(db: Session, conv: Conversation) -> None:
    db.delete(conv)
    db.commit()


def add_message(db: Session, conversation_id: int, role: str, content: str, meta: dict | None = None) -> Message:
    msg = Message(conversation_id=conversation_id, role=role, content=content, meta=meta)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


def get_messages(db: Session, conversation_id: int) -> list[Message]:
    return (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )


def get_recent_messages(db: Session, conversation_id: int, limit: int = 10) -> list[Message]:
    return (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.desc())
        .limit(limit)
        .all()[::-1]
    )
