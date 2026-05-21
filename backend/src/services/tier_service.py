from datetime import datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.core.exceptions import PlanLimitError
from src.models.query_usage_log import QueryUsageLog

LIMITS: dict[str, dict] = {
    "free": {
        "max_docs": 5,
        "max_file_mb": 10,
        "allowed_types": {"pdf", "txt", "md"},
        "max_queries_day": 20,
        "history_days": 7,
    },
    "pro": {
        "max_docs": None,
        "max_file_mb": 50,
        "allowed_types": {"pdf", "docx", "txt", "md"},
        "max_queries_day": None,
        "history_days": None,
    },
}


class TierService:
    def _limits(self, plan: str) -> dict:
        return LIMITS.get(plan, LIMITS["free"])

    def check_upload(self, plan: str, files: list, current_doc_count: int) -> None:
        limits = self._limits(plan)
        if limits["max_docs"] is not None and current_doc_count + len(files) > limits["max_docs"]:
            raise PlanLimitError("documents")
        max_bytes = limits["max_file_mb"] * 1024 * 1024
        for f in files:
            size = getattr(f, "size", None) or 0
            if size > max_bytes:
                raise PlanLimitError("file_size")
            ext = f.filename.rsplit(".", 1)[-1].lower() if "." in f.filename else ""
            if ext not in limits["allowed_types"]:
                raise PlanLimitError("file_type")

    def check_ask(self, plan: str, query_count_24h: int) -> None:
        limits = self._limits(plan)
        if limits["max_queries_day"] is not None and query_count_24h >= limits["max_queries_day"]:
            raise PlanLimitError("queries")

    def check_history(self, plan: str, conversation_age_days: float) -> None:
        limits = self._limits(plan)
        if limits["history_days"] is not None and conversation_age_days > limits["history_days"]:
            raise PlanLimitError("history")

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
