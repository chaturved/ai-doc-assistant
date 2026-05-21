from sqlalchemy import Boolean, Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship
from ..database.db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=True)
    avatar_initials = Column(String(4), nullable=True)
    plan = Column(String(20), nullable=False, default="free")
    onboarding_completed = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    libraries = relationship("Library", back_populates="user", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    oauth_accounts = relationship("OAuthAccount", back_populates="user", cascade="all, delete-orphan")
    reset_tokens = relationship("ResetToken", back_populates="user", cascade="all, delete-orphan")
    recent_queries = relationship("RecentQuery", back_populates="user", cascade="all, delete-orphan")
    query_usage_logs = relationship("QueryUsageLog", back_populates="user", cascade="all, delete-orphan")
