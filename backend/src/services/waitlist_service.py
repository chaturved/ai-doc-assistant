from typing import Protocol

from fastapi import Depends

from src.repositories.waitlist_repository import IWaitlistRepository, WaitlistRepository
from src.schemas.user import MessageResponse


class IWaitlistService(Protocol):
    def join(self, email: str) -> MessageResponse: ...


class WaitlistService(IWaitlistService):
    def __init__(self, repo: IWaitlistRepository = Depends(WaitlistRepository)):
        self.repo = repo

    def join(self, email: str) -> MessageResponse:
        if self.repo.exists(email):
            return MessageResponse(message="You're already on the list!")
        self.repo.add(email)
        return MessageResponse(message="You're on the list!")
