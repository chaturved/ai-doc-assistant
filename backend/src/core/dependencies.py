from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer

from ..config import ACCESS_TOKEN_KEY
from ..database.db import SessionLocal
from ..services.token_service import validate_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token", auto_error=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user_id(request: Request, bearer: str = Depends(oauth2_scheme)) -> int:
    token = bearer or request.cookies.get(ACCESS_TOKEN_KEY)
    if not token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    return validate_access_token(token)
