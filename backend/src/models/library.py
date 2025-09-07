from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship

from ..database.db import Base

class Library(Base):
    __tablename__ = "libraries"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    size = Column(String, nullable=False)
    type = Column(String, nullable=False)
    path = Column(String)
    extracted_text = Column(Text)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    chunks = relationship("LibraryChunk", back_populates="library", cascade="all, delete-orphan")
