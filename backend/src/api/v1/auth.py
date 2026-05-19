from fastapi import APIRouter, Depends, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from src.schemas.user import ForgotPasswordRequest, MagicLinkRequest, ResetPasswordRequest, UserCreate
from src.database.db import get_db
from src.services.auth_service import (
    forgot_password,
    get_current_user_id,
    get_me,
    google_callback,
    google_redirect,
    login,
    authorize_token,
    logout,
    refresh,
    reset_password,
    send_magic_link,
    signup,
    verify_magic_link,
)

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup")
def signup_route(user_in: UserCreate, response: Response, db: Session = Depends(get_db)):
    return signup(user_in, db, response)


@router.post("/login")
def login_route(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    return login(response, form_data, db)


@router.post("/token", include_in_schema=False)
def token_route(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return authorize_token(form_data, db)


@router.post("/logout")
def logout_route(response: Response):
    return logout(response)


@router.post("/refresh")
def refresh_route(request: Request, response: Response):
    return refresh(request, response)


@router.get("/me")
def me_route(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return get_me(db, user_id)


@router.get("/google")
async def google_login(request: Request):
    return await google_redirect(request)


@router.get("/google/callback")
async def google_cb(request: Request, response: Response, db: Session = Depends(get_db)):
    return await google_callback(request, response, db)


@router.post("/magic-link")
def magic_link(body: MagicLinkRequest, db: Session = Depends(get_db)):
    return send_magic_link(body.email, db)


@router.get("/magic-link/verify")
def magic_link_verify(token: str, response: Response, db: Session = Depends(get_db)):
    return verify_magic_link(token, db, response)


@router.post("/forgot-password")
def forgot_pw(body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    return forgot_password(body.email, db)


@router.post("/reset-password")
def reset_pw(body: ResetPasswordRequest, db: Session = Depends(get_db)):
    return reset_password(body.token, body.new_password, db)
