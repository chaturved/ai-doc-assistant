from sqlalchemy import Column, DateTime, Integer, String, func
from ..database.db import Base

class MagicToken(Base):
    __tablename__ = "magic_tokens"

    id = Column(Integer, primary_key=True)
    email = Column(String(255), nullable=False)
    token_hash = Column(String(255), nullable=False, unique=True)
    expires_at = Column(DateTime, nullable=False)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
