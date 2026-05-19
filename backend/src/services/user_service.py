from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from src.models.user import User
from src.schemas.user import UserCreate
from src.utils.security import hash_password, verify_password
from src.repositories.user_repository import (
    add_user,
    count_queries_today,
    count_user_documents,
    delete_user,
    get_user_by_id,
    sum_storage_bytes,
    update_user,
)

FREE_TIER = {
    "max_documents": 5,
    "max_queries_day": 20,
    "max_storage_bytes": 52_428_800,  # 50 MB
}


def _make_initials(full_name: str) -> str:
    parts = full_name.strip().split()
    if len(parts) >= 2:
        return (parts[0][0] + parts[-1][0]).upper()
    return full_name[:2].upper()


def create_user(db: Session, user_in: UserCreate) -> User:
    user = User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        full_name=user_in.full_name,
        avatar_initials=_make_initials(user_in.full_name),
    )
    return add_user(db, user)


def create_user_oauth(db: Session, email: str, full_name: str) -> User:
    user = User(
        email=email,
        hashed_password=None,
        full_name=full_name,
        avatar_initials=_make_initials(full_name),
    )
    return add_user(db, user)


def update_profile(db: Session, user_id: int, full_name: str) -> dict:
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    user.full_name = full_name
    user.avatar_initials = _make_initials(full_name)
    update_user(db, user)
    return {"id": user.id, "email": user.email, "full_name": user.full_name, "avatar_initials": user.avatar_initials}


def change_password(db: Session, user_id: int, current_password: str, new_password: str) -> dict:
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    if not user.hashed_password or not verify_password(current_password, user.hashed_password):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Current password is incorrect")
    if len(new_password) < 8:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Password must be at least 8 characters")
    user.hashed_password = hash_password(new_password)
    update_user(db, user)
    return {"message": "Password updated"}


def set_password(db: Session, user_id: int, new_password: str) -> dict:
    """For OAuth users setting a password for the first time."""
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    if len(new_password) < 8:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Password must be at least 8 characters")
    user.hashed_password = hash_password(new_password)
    update_user(db, user)
    return {"message": "Password set"}


def remove_account(db: Session, user_id: int, confirmation: str) -> dict:
    if confirmation != "DELETE":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Type DELETE to confirm")
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    delete_user(db, user)
    return {"message": "Account deleted"}


def complete_onboarding(db: Session, user_id: int) -> dict:
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    user.onboarding_completed = True
    update_user(db, user)
    return {"message": "Onboarding complete"}


def get_usage(db: Session, user_id: int) -> dict:
    docs_used = count_user_documents(db, user_id)
    queries_used = count_queries_today(db, user_id)
    storage_used = sum_storage_bytes(db, user_id)

    return {
        "documents": {"used": docs_used, "limit": FREE_TIER["max_documents"]},
        "queries_today": {"used": queries_used, "limit": FREE_TIER["max_queries_day"]},
        "storage_bytes": {"used": storage_used, "limit": FREE_TIER["max_storage_bytes"]},
    }
