from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from ..database.db import Base


class MessageFeedback(Base):
    __tablename__ = "message_feedback"

    id = Column(Integer, primary_key=True)
    message_id = Column(Integer, ForeignKey("messages.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    value = Column(String(4), nullable=False)  # 'up' | 'down'
    created_at = Column(DateTime, server_default=func.now())

    __table_args__ = (UniqueConstraint("message_id", "user_id", name="uq_feedback_message_user"),)
