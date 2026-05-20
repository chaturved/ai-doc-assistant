from abc import abstractmethod
from typing import Protocol

from fastapi import Depends

from src.core.exceptions import BadRequestError
from src.models.message_feedback import MessageFeedback
from src.repositories.analytics_repository import AnalyticsRepository, IAnalyticsRepository


class IAnalyticsService(Protocol):
    @abstractmethod
    def get_overview(self, user_id: int) -> dict: ...
    @abstractmethod
    def get_query_volume(self, user_id: int, days: int) -> list[dict]: ...
    @abstractmethod
    def get_top_cited_docs(self, user_id: int) -> list[dict]: ...
    @abstractmethod
    def set_feedback(self, message_id: int, user_id: int, value: str) -> MessageFeedback: ...
    @abstractmethod
    def get_feedbacks(self, user_id: int, message_ids: list[int]) -> dict[int, str]: ...


class AnalyticsService(IAnalyticsService):
    def __init__(self, repo: IAnalyticsRepository = Depends(AnalyticsRepository)):
        self.repo = repo

    def get_overview(self, user_id: int) -> dict:
        return self.repo.get_overview(user_id)

    def get_query_volume(self, user_id: int, days: int = 30) -> list[dict]:
        return self.repo.get_query_volume(user_id, days)

    def get_top_cited_docs(self, user_id: int) -> list[dict]:
        return self.repo.get_top_cited_docs(user_id)

    def set_feedback(self, message_id: int, user_id: int, value: str):
        if value not in ("up", "down"):
            raise BadRequestError("Feedback value must be 'up' or 'down'")
        return self.repo.upsert_feedback(message_id, user_id, value)

    def get_feedbacks(self, user_id: int, message_ids: list[int]) -> dict[int, str]:
        return self.repo.get_user_feedbacks(user_id, message_ids)
