from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, ForeignKey

Base = declarative_base()

class Library(Base):
    __tablename__ = "library"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    size = Column(String, nullable=False)
    type = Column(String, nullable=False)
