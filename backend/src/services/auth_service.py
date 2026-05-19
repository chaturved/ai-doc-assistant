import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from authlib.integrations.starlette_client import OAuth
from fastapi import HTTPException, Request, Response, status
from fastapi.params import Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..config import (
    ACCESS_TOKEN_KEY,
    APP_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    REFRESH_TOKEN_KEY,
)
from ..repositories.user_repository import (
    create_magic_token,
    create_oauth_account,
    create_reset_token,
    get_magic_token,
    get_oauth_account,
    get_reset_token,
    get_user_by_email,
    get_user_by_id,
    mark_magic_token_used,
    mark_reset_token_used,
    update_user,
)
from ..schemas.user import UserCreate
from ..services.token_service import (
    create_access_token,
    create_refresh_token,
    validate_access_token,
    validate_refresh_token,
)
from ..services.user_service import create_user
from ..utils.email_utils import send_magic_link_email, send_password_reset_email
from ..utils.security import hash_password, verify_password

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token", auto_error=False)

# Google OAuth client (lazy init)
_oauth = OAuth()
_oauth.register(
    name="google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
    redirect_uri=GOOGLE_REDIRECT_URI,
)


def _set_auth_cookies(response: Response, user_id: int) -> None:
    response.set_cookie(ACCESS_TOKEN_KEY, create_access_token(user_id), httponly=True, secure=True, samesite="lax")
    response.set_cookie(REFRESH_TOKEN_KEY, create_refresh_token(user_id), httponly=True, secure=True, samesite="lax")


def signup(user_in: UserCreate, db: Session, response: Response) -> dict:
    if get_user_by_email(db, user_in.email):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "An account with this email already exists")
    user = create_user(db, user_in)
    _set_auth_cookies(response, user.id)
    try:
        from ..utils.email_utils import send_welcome_email
        send_welcome_email(user.email, user.full_name.split()[0])
    except Exception:
        pass
    return {"user": {"id": user.id, "email": user.email, "full_name": user.full_name, "plan": user.plan}}


def login(response: Response, form_data: OAuth2PasswordRequestForm, db: Session) -> dict:
    user = get_user_by_email(db, form_data.username)
    if not user or not user.hashed_password or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect email or password")
    _set_auth_cookies(response, user.id)
    return {"user": {"id": user.id, "email": user.email, "full_name": user.full_name, "plan": user.plan}}


def authorize_token(form_data: OAuth2PasswordRequestForm, db: Session) -> dict:
    user = get_user_by_email(db, form_data.username)
    if not user or not user.hashed_password or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect email or password")
    return {"access_token": create_access_token(user.id), "token_type": "bearer"}


def get_current_user_id(request: Request, bearer: str = Depends(oauth2_scheme)) -> int:
    token = bearer or request.cookies.get(ACCESS_TOKEN_KEY)
    if not token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    return validate_access_token(token)


def refresh(request: Request, response: Response) -> dict:
    token = request.cookies.get(REFRESH_TOKEN_KEY)
    if not token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing refresh token")
    user_id = validate_refresh_token(token)
    response.set_cookie(ACCESS_TOKEN_KEY, create_access_token(user_id), httponly=True, secure=True, samesite="lax")
    return {"message": "Token refreshed"}


def logout(response: Response) -> dict:
    response.delete_cookie(ACCESS_TOKEN_KEY)
    response.delete_cookie(REFRESH_TOKEN_KEY)
    return {"message": "Logged out"}


def get_me(db: Session, user_id: int) -> dict:
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "plan": user.plan,
        "avatar_initials": user.avatar_initials,
        "onboarding_completed": user.onboarding_completed,
    }


# Google OAuth

async def google_redirect(request: Request):
    return await _oauth.google.authorize_redirect(request, GOOGLE_REDIRECT_URI)


async def google_callback(request: Request, response: Response, db: Session):
    token = await _oauth.google.authorize_access_token(request)
    userinfo = token.get("userinfo") or await _oauth.google.userinfo(token=token)

    email = userinfo["email"]
    provider_user_id = userinfo["sub"]
    full_name = userinfo.get("name", email.split("@")[0])

    # Find or create user
    oauth_acct = get_oauth_account(db, "google", provider_user_id)
    if oauth_acct:
        user = get_user_by_id(db, oauth_acct.user_id)
    else:
        user = get_user_by_email(db, email)
        if not user:
            from ..services.user_service import create_user_oauth
            user = create_user_oauth(db, email, full_name)
            try:
                from ..utils.email_utils import send_welcome_email
                send_welcome_email(user.email, user.full_name.split()[0])
            except Exception:
                pass
        create_oauth_account(db, user.id, "google", provider_user_id,
                             token.get("access_token"), token.get("refresh_token"))

    _set_auth_cookies(response, user.id)
    redirect_to = APP_URL + ("/onboarding" if not user.onboarding_completed else "/dashboard")
    from fastapi.responses import RedirectResponse
    return RedirectResponse(redirect_to)


# Magic link

def send_magic_link(email: str, db: Session) -> dict:
    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)
    create_magic_token(db, email, token_hash, expires_at)
    try:
        send_magic_link_email(email, raw_token)
    except Exception:
        pass
    return {"message": "If an account exists, a link has been sent."}


def verify_magic_link(token: str, db: Session, response: Response):
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    mt = get_magic_token(db, token_hash)

    if not mt or mt.used_at or mt.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        from fastapi.responses import RedirectResponse
        return RedirectResponse(APP_URL + "/login?error=invalid_link")

    user = get_user_by_email(db, mt.email)
    if not user:
        from fastapi.responses import RedirectResponse
        return RedirectResponse(APP_URL + "/login?error=no_account")

    mark_magic_token_used(db, mt)
    _set_auth_cookies(response, user.id)
    from fastapi.responses import RedirectResponse
    return RedirectResponse(APP_URL + "/dashboard")


# Password reset

def forgot_password(email: str, db: Session) -> dict:
    user = get_user_by_email(db, email)
    if user:
        raw_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
        create_reset_token(db, user.id, token_hash, expires_at)
        try:
            send_password_reset_email(email, raw_token)
        except Exception:
            pass
    return {"message": "If an account exists, a reset link has been sent."}


def reset_password(token: str, new_password: str, db: Session) -> dict:
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    rt = get_reset_token(db, token_hash)

    if not rt or rt.used_at or rt.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired reset token")

    user = get_user_by_id(db, rt.user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    user.hashed_password = hash_password(new_password)
    mark_reset_token_used(db, rt)
    update_user(db, user)
    return {"message": "Password updated successfully"}
