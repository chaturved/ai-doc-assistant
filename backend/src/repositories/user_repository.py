from datetime import datetime
from typing import Optional, Protocol

from fastapi import Depends
from sqlalchemy.orm import Session

from src.database.db import get_db
from src.models.conversation import Conversation
from src.models.library import Library
from src.models.magic_token import MagicToken
from src.models.message import Message
from src.models.oauth_account import OAuthAccount
from src.models.reset_token import ResetToken
from src.models.user import User


class IUserRepository(Protocol):
    def add(self, user: User) -> User: ...
    def get_by_email(self, email: str) -> Optional[User]: ...
    def get_by_id(self, user_id: int) -> Optional[User]: ...
    def update(self, user: User) -> User: ...
    def delete(self, user: User) -> None: ...
    def get_oauth_account(self, provider: str, provider_user_id: str) -> Optional[OAuthAccount]: ...
    def create_oauth_account(
        self,
        user_id: int,
        provider: str,
        provider_user_id: str,
        access_token: Optional[str],
        refresh_token: Optional[str],
    ) -> OAuthAccount: ...
    def create_magic_token(self, email: str, token_hash: str, expires_at: datetime) -> MagicToken: ...
    def get_magic_token(self, token_hash: str) -> Optional[MagicToken]: ...
    def mark_magic_token_used(self, mt: MagicToken) -> None: ...
    def create_reset_token(self, user_id: int, token_hash: str, expires_at: datetime) -> ResetToken: ...
    def get_reset_token(self, token_hash: str) -> Optional[ResetToken]: ...
    def mark_reset_token_used(self, rt: ResetToken) -> None: ...
    def count_documents(self, user_id: int) -> int: ...
    def count_queries_today(self, user_id: int) -> int: ...
    def sum_storage_bytes(self, user_id: int) -> int: ...


class UserRepository(IUserRepository):
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def add(self, user: User) -> User:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def update(self, user: User) -> User:
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, user: User) -> None:
        self.db.delete(user)
        self.db.commit()

    # ─── OAuth ────────────────────────────────────────────────────────────────

    def get_oauth_account(self, provider: str, provider_user_id: str) -> Optional[OAuthAccount]:
        return (
            self.db.query(OAuthAccount)
            .filter(OAuthAccount.provider == provider, OAuthAccount.provider_user_id == provider_user_id)
            .first()
        )

    def create_oauth_account(
        self,
        user_id: int,
        provider: str,
        provider_user_id: str,
        access_token: Optional[str] = None,
        refresh_token: Optional[str] = None,
    ) -> OAuthAccount:
        acct = OAuthAccount(
            user_id=user_id,
            provider=provider,
            provider_user_id=provider_user_id,
            access_token=access_token,
            refresh_token=refresh_token,
        )
        self.db.add(acct)
        self.db.commit()
        self.db.refresh(acct)
        return acct

    # ─── Magic tokens ─────────────────────────────────────────────────────────

    def create_magic_token(self, email: str, token_hash: str, expires_at: datetime) -> MagicToken:
        mt = MagicToken(email=email, token_hash=token_hash, expires_at=expires_at)
        self.db.add(mt)
        self.db.commit()
        self.db.refresh(mt)
        return mt

    def get_magic_token(self, token_hash: str) -> Optional[MagicToken]:
        return self.db.query(MagicToken).filter(MagicToken.token_hash == token_hash).first()

    def mark_magic_token_used(self, mt: MagicToken) -> None:
        mt.used_at = datetime.utcnow()
        self.db.commit()

    # ─── Reset tokens ─────────────────────────────────────────────────────────

    def create_reset_token(self, user_id: int, token_hash: str, expires_at: datetime) -> ResetToken:
        rt = ResetToken(user_id=user_id, token_hash=token_hash, expires_at=expires_at)
        self.db.add(rt)
        self.db.commit()
        self.db.refresh(rt)
        return rt

    def get_reset_token(self, token_hash: str) -> Optional[ResetToken]:
        return self.db.query(ResetToken).filter(ResetToken.token_hash == token_hash).first()

    def mark_reset_token_used(self, rt: ResetToken) -> None:
        rt.used_at = datetime.utcnow()
        self.db.commit()

    # ─── Usage stats ──────────────────────────────────────────────────────────

    def count_documents(self, user_id: int) -> int:
        return self.db.query(Library).filter(Library.user_id == user_id).count()

    def count_queries_today(self, user_id: int) -> int:
        from sqlalchemy import func
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        return (
            self.db.query(Message)
            .join(Conversation, Message.conversation_id == Conversation.id)
            .filter(
                Conversation.user_id == user_id,
                Message.role == "user",
                Message.created_at >= today_start,
            )
            .count()
        )

    def sum_storage_bytes(self, user_id: int) -> int:
        from sqlalchemy import func
        result = self.db.query(func.sum(Library.size)).filter(Library.user_id == user_id).scalar()
        return int(result or 0)
