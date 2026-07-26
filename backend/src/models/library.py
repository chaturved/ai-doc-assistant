from __future__ import annotations

from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database.db import Base

if TYPE_CHECKING:
    from .library_chunk import LibraryChunk
    from .user import User


class Library(Base):
    __tablename__ = "libraries"
    __table_args__ = (UniqueConstraint("user_id", "content_hash", name="uq_libraries_user_content_hash"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String)
    size: Mapped[int] = mapped_column(Integer)
    type: Mapped[str] = mapped_column(String)
    path: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    extracted_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    content_hash: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    created_at: Mapped[Optional[datetime]] = mapped_column(DateTime, default=datetime.now(timezone.utc))

    chunks: Mapped[list[LibraryChunk]] = relationship("LibraryChunk", back_populates="library", cascade="all, delete-orphan")
    user: Mapped[User] = relationship("User", back_populates="libraries")
