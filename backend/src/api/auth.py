from fastapi import APIRouter, Depends, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from backend.src.schemas.user import UserCreate
from backend.src.database.db import get_db
from backend.src.services.auth_service import signup, login, refresh, logout

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup")
def signup_route(user_in: UserCreate, db: Session = Depends(get_db)):
    return signup(user_in, db)


@router.post("/token")
def login_route(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    return login(response, form_data, db)


@router.post("/refresh")
def refresh_route(request: Request):
    return refresh(request)


@router.post("/logout")
def logout_route(response: Response):
    return logout(response)
