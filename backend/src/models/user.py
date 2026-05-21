from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database.db import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    full_name: Mapped[str] = mapped_column(String(255))
    hashed_password: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    avatar_initials: Mapped[Optional[str]] = mapped_column(String(4), nullable=True)
    plan: Mapped[str] = mapped_column(String(20), default="free")
    onboarding_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[Optional[datetime]] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    libraries: Mapped[list["Library"]] = relationship("Library", back_populates="user", cascade="all, delete-orphan")
    conversations: Mapped[list["Conversation"]] = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    oauth_accounts: Mapped[list["OAuthAccount"]] = relationship("OAuthAccount", back_populates="user", cascade="all, delete-orphan")
    reset_tokens: Mapped[list["ResetToken"]] = relationship("ResetToken", back_populates="user", cascade="all, delete-orphan")
    recent_queries: Mapped[list["RecentQuery"]] = relationship("RecentQuery", back_populates="user", cascade="all, delete-orphan")
    query_usage_logs: Mapped[list["QueryUsageLog"]] = relationship("QueryUsageLog", back_populates="user", cascade="all, delete-orphan")
