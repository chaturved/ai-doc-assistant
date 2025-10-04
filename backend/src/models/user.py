from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database.db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String)
    hashed_password = Column(String, nullable=False)
    recent_queries = relationship("RecentQuery", back_populates="user")

