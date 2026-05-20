from abc import abstractmethod
from typing import Protocol

from fastapi import Depends
from sqlalchemy.orm import Session

from src.database.db import get_db
from src.models.waitlist import Waitlist


class IWaitlistRepository(Protocol):
    @abstractmethod
    def add(self, email: str) -> Waitlist: ...
    @abstractmethod
    def exists(self, email: str) -> bool: ...


class WaitlistRepository(IWaitlistRepository):
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def add(self, email: str) -> Waitlist:
        entry = Waitlist(email=email)
        self.db.add(entry)
        self.db.commit()
        self.db.refresh(entry)
        return entry

    def exists(self, email: str) -> bool:
        return self.db.query(Waitlist).filter(Waitlist.email == email).first() is not None
