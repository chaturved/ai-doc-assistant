from fastapi import HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from backend.src.models.user import User
from backend.src.services.token_service import create_access_token, create_refresh_token, validate_refresh_token
from backend.src.utils.security import verify_password
from backend.src.schemas.user import UserCreate
from backend.src.services.user_service import create_user, get_user_by_email


def signup(user_in: UserCreate, db: Session) -> dict:
    if get_user_by_email(db, user_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    user = create_user(db, user_in)
    return {"id": user.id, "email": user.email, "full_name": user.full_name}


def login(response: Response, form_data: OAuth2PasswordRequestForm, db: Session) -> dict:
    user = get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
    )

    return {"access_token": access_token, "token_type": "bearer"}


def refresh(request: Request) -> dict:
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")
    
    user_id = validate_refresh_token(refresh_token)
    new_access_token = create_access_token(user_id)

    return {"access_token": new_access_token, "token_type": "bearer"}


def logout(response: Response) -> dict:
    response.delete_cookie("refresh_token")
    return {"status": "logged out"}
