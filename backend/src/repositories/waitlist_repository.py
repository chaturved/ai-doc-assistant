from sqlalchemy.orm import Session
from src.models.waitlist import Waitlist


def add_to_waitlist(db: Session, email: str) -> Waitlist:
    entry = Waitlist(email=email)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def email_on_waitlist(db: Session, email: str) -> bool:
    return db.query(Waitlist).filter(Waitlist.email == email).first() is not None
