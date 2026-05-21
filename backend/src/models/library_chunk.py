from typing import Optional

from sqlalchemy import ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database.db import Base

try:
    from pgvector.sqlalchemy import Vector
    _has_vector = True
except ImportError:
    _has_vector = False


class LibraryChunk(Base):
    __tablename__ = "library_chunks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    library_id: Mapped[int] = mapped_column(ForeignKey("libraries.id"))
    chunk_index: Mapped[int] = mapped_column(Integer)
    chunk_text: Mapped[str] = mapped_column(Text)
    embedding = mapped_column(Vector(384) if _has_vector else Text, nullable=True)

    library: Mapped["Library"] = relationship("Library", back_populates="chunks")
