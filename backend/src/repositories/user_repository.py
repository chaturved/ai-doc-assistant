from sqlalchemy.orm import Session
from src.models.user import User
from src.models.oauth_account import OAuthAccount
from src.models.magic_token import MagicToken
from src.models.reset_token import ResetToken
from src.models.message import Message
from src.models.library import Library
from typing import Optional
from datetime import datetime


def add_user(db: Session, user: User) -> User:
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def update_user(db: Session, user: User) -> User:
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user: User) -> None:
    db.delete(user)
    db.commit()


# OAuth

def get_oauth_account(db: Session, provider: str, provider_user_id: str) -> Optional[OAuthAccount]:
    return (
        db.query(OAuthAccount)
        .filter(OAuthAccount.provider == provider, OAuthAccount.provider_user_id == provider_user_id)
        .first()
    )


def create_oauth_account(db: Session, user_id: int, provider: str, provider_user_id: str,
                          access_token: str | None = None, refresh_token: str | None = None) -> OAuthAccount:
    acct = OAuthAccount(
        user_id=user_id,
        provider=provider,
        provider_user_id=provider_user_id,
        access_token=access_token,
        refresh_token=refresh_token,
    )
    db.add(acct)
    db.commit()
    db.refresh(acct)
    return acct


# Magic tokens

def create_magic_token(db: Session, email: str, token_hash: str, expires_at: datetime) -> MagicToken:
    mt = MagicToken(email=email, token_hash=token_hash, expires_at=expires_at)
    db.add(mt)
    db.commit()
    db.refresh(mt)
    return mt


def get_magic_token(db: Session, token_hash: str) -> Optional[MagicToken]:
    return db.query(MagicToken).filter(MagicToken.token_hash == token_hash).first()


def mark_magic_token_used(db: Session, mt: MagicToken) -> None:
    mt.used_at = datetime.utcnow()
    db.commit()


# Reset tokens

def create_reset_token(db: Session, user_id: int, token_hash: str, expires_at: datetime) -> ResetToken:
    rt = ResetToken(user_id=user_id, token_hash=token_hash, expires_at=expires_at)
    db.add(rt)
    db.commit()
    db.refresh(rt)
    return rt


def get_reset_token(db: Session, token_hash: str) -> Optional[ResetToken]:
    return db.query(ResetToken).filter(ResetToken.token_hash == token_hash).first()


def mark_reset_token_used(db: Session, rt: ResetToken) -> None:
    rt.used_at = datetime.utcnow()
    db.commit()


# Usage stats

def count_user_documents(db: Session, user_id: int) -> int:
    return db.query(Library).filter(Library.user_id == user_id).count()


def count_queries_today(db: Session, user_id: int) -> int:
    from sqlalchemy import func
    from src.models.conversation import Conversation
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    return (
        db.query(Message)
        .join(Conversation, Message.conversation_id == Conversation.id)
        .filter(
            Conversation.user_id == user_id,
            Message.role == "user",
            Message.created_at >= today_start,
        )
        .count()
    )


def sum_storage_bytes(db: Session, user_id: int) -> int:
    from sqlalchemy import func
    result = db.query(func.sum(Library.size)).filter(Library.user_id == user_id).scalar()
    return int(result or 0)
