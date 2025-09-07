from datetime import timedelta, datetime, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from ..config import (
    ACCESS_TOKEN_EXPIRE_MINUTES, 
    ACCESS_TOKEN_TYPE, 
    REFRESH_TOKEN_EXPIRE_DAYS, 
    REFRESH_TOKEN_TYPE
)

from ..utils.jwt import get_encoded_token, get_payload

# OAuth2 scheme for FastAPI dependency injection
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


def _create_token(user_id: int, expires_delta: timedelta, token_type: str) -> str:
    expire = datetime.now(timezone.utc) + expires_delta
    claims = {
        "sub": str(user_id),
        "exp": int(expire.timestamp()),
        "type": token_type,
    }
    return get_encoded_token(claims)


def create_access_token(user_id: int) -> str:
    return _create_token(
        user_id,
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        token_type=ACCESS_TOKEN_TYPE,
    )


def create_refresh_token(user_id: int) -> str:
    return _create_token(
        user_id,
        expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        token_type=REFRESH_TOKEN_TYPE,
    )


def get_current_user_id(token: str = Depends(oauth2_scheme)) -> int:
    payload = get_payload(token)

    if payload.get("type") != ACCESS_TOKEN_TYPE:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return int(user_id)

def validate_refresh_token(token: str) -> int:
    payload = get_payload(token)

    if payload.get("type") != REFRESH_TOKEN_TYPE:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    return int(user_id)
