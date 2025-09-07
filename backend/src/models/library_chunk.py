from sqlalchemy import Column, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from ..database.db import Base
from pgvector.sqlalchemy import Vector

class LibraryChunk(Base):
    __tablename__ = "library_chunks"

    id = Column(Integer, primary_key=True, index=True)
    library_id = Column(Integer, ForeignKey("libraries.id"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    chunk_text = Column(Text, nullable=False)
    library = relationship("Library", back_populates="chunks")
    embedding = Column(Vector(1536))
