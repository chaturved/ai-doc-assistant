from typing import List
from sqlalchemy.orm import Session
from src.models import RecentQuery

def add_recent_query(db: Session, user_id: int, query: str) -> RecentQuery:
    recent = RecentQuery(user_id=user_id, query=query)
    db.add(recent)
    db.commit()
    return recent

def get_recent_queries(db: Session, user_id: int, limit: int = 5) -> List[RecentQuery]:
    return (
        db.query(RecentQuery)
        .filter(RecentQuery.user_id == user_id)
        .order_by(RecentQuery.created_at.desc())
        .limit(limit)
        .all()
    )
