from datetime import datetime, timedelta, timezone
from sqlalchemy import func, text
from sqlalchemy.orm import Session

from src.models import Library, MessageFeedback, RecentQuery
from src.models.library_chunk import LibraryChunk


def get_overview(db: Session, user_id: int) -> dict:
    total_queries = db.query(func.count(RecentQuery.id)).filter(RecentQuery.user_id == user_id).scalar() or 0
    total_docs = db.query(func.count(Library.id)).filter(Library.user_id == user_id).scalar() or 0
    total_chunks = (
        db.query(func.count(LibraryChunk.id))
        .join(Library, LibraryChunk.library_id == Library.id)
        .filter(Library.user_id == user_id)
        .scalar() or 0
    )

    feedback_rows = (
        db.query(MessageFeedback.value, func.count(MessageFeedback.id))
        .filter(MessageFeedback.user_id == user_id)
        .group_by(MessageFeedback.value)
        .all()
    )
    feedback = {row[0]: row[1] for row in feedback_rows}
    thumbs_up = feedback.get("up", 0)
    thumbs_down = feedback.get("down", 0)
    total_feedback = thumbs_up + thumbs_down
    quality_pct = round(thumbs_up / total_feedback * 100) if total_feedback > 0 else None

    since_30d = datetime.now(timezone.utc) - timedelta(days=30)
    queries_30d = (
        db.query(func.count(RecentQuery.id))
        .filter(RecentQuery.user_id == user_id, RecentQuery.created_at >= since_30d)
        .scalar() or 0
    )

    return {
        "total_queries": total_queries,
        "total_docs": total_docs,
        "total_chunks": total_chunks,
        "quality_pct": quality_pct,
        "thumbs_up": thumbs_up,
        "thumbs_down": thumbs_down,
        "queries_last_30d": queries_30d,
    }


def get_query_volume(db: Session, user_id: int, days: int = 30) -> list[dict]:
    since = datetime.now(timezone.utc) - timedelta(days=days)
    rows = (
        db.query(func.date(RecentQuery.created_at).label("day"), func.count(RecentQuery.id).label("count"))
        .filter(RecentQuery.user_id == user_id, RecentQuery.created_at >= since)
        .group_by(func.date(RecentQuery.created_at))
        .order_by(func.date(RecentQuery.created_at))
        .all()
    )
    return [{"date": str(row.day), "count": row.count} for row in rows]


def get_top_cited_docs(db: Session, user_id: int, limit: int = 10) -> list[dict]:
    # Count how many assistant messages cite each doc name via JSONB sources array
    rows = db.execute(
        text("""
            SELECT source->>'name' AS doc_name, COUNT(*) AS citation_count
            FROM messages m
            JOIN conversations c ON c.id = m.conversation_id
            CROSS JOIN jsonb_array_elements(m.meta->'sources') AS source
            WHERE c.user_id = :user_id
              AND m.role = 'assistant'
              AND m.meta IS NOT NULL
            GROUP BY source->>'name'
            ORDER BY citation_count DESC
            LIMIT :limit
        """),
        {"user_id": user_id, "limit": limit},
    ).fetchall()
    return [{"name": row.doc_name, "citations": row.citation_count} for row in rows]


def upsert_feedback(db: Session, message_id: int, user_id: int, value: str) -> MessageFeedback:
    existing = (
        db.query(MessageFeedback)
        .filter(MessageFeedback.message_id == message_id, MessageFeedback.user_id == user_id)
        .first()
    )
    if existing:
        existing.value = value
        db.commit()
        db.refresh(existing)
        return existing
    feedback = MessageFeedback(message_id=message_id, user_id=user_id, value=value)
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback


def get_user_feedbacks(db: Session, user_id: int, message_ids: list[int]) -> dict[int, str]:
    if not message_ids:
        return {}
    rows = (
        db.query(MessageFeedback.message_id, MessageFeedback.value)
        .filter(MessageFeedback.user_id == user_id, MessageFeedback.message_id.in_(message_ids))
        .all()
    )
    return {row.message_id: row.value for row in rows}
