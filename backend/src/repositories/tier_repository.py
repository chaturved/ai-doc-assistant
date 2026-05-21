from abc import abstractmethod
from datetime import datetime, timedelta
from typing import Protocol

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.models.query_usage_log import QueryUsageLog


class ITierRepository(Protocol):
    @abstractmethod
    def count_queries_24h(self, user_id: int, db: Session) -> int: ...
    @abstractmethod
    def log_query(self, user_id: int, db: Session) -> None: ...


class TierRepository:
    def count_queries_24h(self, user_id: int, db: Session) -> int:
        cutoff = datetime.utcnow() - timedelta(hours=24)
        stmt = (
            select(func.count())
            .select_from(QueryUsageLog)
            .where(
                QueryUsageLog.user_id == user_id,
                QueryUsageLog.created_at >= cutoff,
            )
        )
        return db.scalar(stmt) or 0

    def log_query(self, user_id: int, db: Session) -> None:
        db.add(QueryUsageLog(user_id=user_id))
        db.commit()
