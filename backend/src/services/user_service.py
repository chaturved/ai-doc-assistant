from sqlalchemy.orm import Session
from src.models.user import User
from src.utils.security import hash_password
from src.schemas.user import UserCreate

def create_user(db: Session, user_in: UserCreate) -> User:
    hashed_pw = hash_password(user_in.password)
    user = User(email=user_in.email, hashed_password=hashed_pw, full_name=user_in.full_name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()
