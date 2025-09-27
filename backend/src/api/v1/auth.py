from fastapi import APIRouter, Depends, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from src.schemas.user import UserCreate
from src.database.db import get_db
from src.services.auth_service import signup, login, authorize_token, refresh, logout

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
def signup_route(user_in: UserCreate, db: Session = Depends(get_db)):
    return signup(user_in, db)

@router.post("/login")
def login_route(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    return login(response, form_data, db)

@router.post("/token", include_in_schema=False)
def token_route(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    return authorize_token(form_data, db)

@router.post("/refresh")
def refresh_route(request: Request, response: Response):
    return refresh(request, response)


@router.post("/logout")
def logout_route(response: Response):
    return logout(response)
