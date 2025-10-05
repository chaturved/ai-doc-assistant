from sqlalchemy.orm import Session
from src.models.user import User
from src.schemas.user import UserCreate
from src.utils.security import hash_password
from src.repositories.user_repository import add_user

def create_user(db: Session, user_in: UserCreate) -> User:
    # Hash the password
    hashed_pw = hash_password(user_in.password)

    # Prepare user model
    user = User(
        email=user_in.email,
        hashed_password=hashed_pw,
        full_name=user_in.full_name
    )

    # Save to DB via repository
    return add_user(db, user)
