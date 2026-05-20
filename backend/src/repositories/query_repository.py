from abc import abstractmethod
from typing import Protocol

from fastapi import Depends
from sqlalchemy.orm import Session

from src.database.db import get_db
from src.models import RecentQuery


class IQueryRepository(Protocol):
    @abstractmethod
    def add_recent_query(self, user_id: int, query: str) -> RecentQuery: ...
    @abstractmethod
    def get_recent_queries(self, user_id: int, limit: int) -> list[RecentQuery]: ...


class QueryRepository(IQueryRepository):
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def add_recent_query(self, user_id: int, query: str) -> RecentQuery:
        recent = RecentQuery(user_id=user_id, query=query)
        self.db.add(recent)
        self.db.commit()
        return recent

    def get_recent_queries(self, user_id: int, limit: int = 5) -> list[RecentQuery]:
        return (
            self.db.query(RecentQuery)
            .filter(RecentQuery.user_id == user_id)
            .order_by(RecentQuery.created_at.desc())
            .limit(limit)
            .all()
        )
