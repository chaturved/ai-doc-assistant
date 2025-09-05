from fastapi import HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..services.token_service import create_access_token, create_refresh_token, validate_refresh_token
from ..utils.security import verify_password
from ..schemas.user import UserCreate
from ..services.user_service import create_user, get_user_by_email

ACCESS_TOKEN_KEY = "access_token"
REFRESH_TOKEN_KEY = "refresh_token"


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
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    response.set_cookie(
        key=ACCESS_TOKEN_KEY,
        value=access_token,
        httponly=True,
        secure=True,
        samesite="strict",
    )

    response.set_cookie(
        key=REFRESH_TOKEN_KEY,
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
    )

    return {"message": "Login successful"}


def refresh(request: Request, response: Response) -> dict:
    refresh_token = request.cookies.get(REFRESH_TOKEN_KEY)
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")
    
    user_id = validate_refresh_token(refresh_token)
    access_token = create_access_token(user_id)

    response.set_cookie(
        key=ACCESS_TOKEN_KEY,
        value=access_token,
        httponly=True,
        secure=True,
        samesite="strict",
    )

    return {"message": "Token refreshed successfully"}


def logout(response: Response) -> dict:
    response.delete_cookie(ACCESS_TOKEN_KEY)
    response.delete_cookie(REFRESH_TOKEN_KEY)
    return {"message": "Logout successful"}
