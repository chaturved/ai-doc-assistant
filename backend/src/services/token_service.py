from datetime import timedelta, datetime, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from backend.src.models.user import User
from backend.src.utils.jwt import get_encoded_token, get_payload

ACCESS_TOKEN_EXPIRE_MINUTES = 60

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


def create_access_token(
    user: User,
    expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
):
    to_encode = {"sub": str(user.id)}
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": int(expire.timestamp())})
    return get_encoded_token(to_encode)


def get_current_user_id(token: str = Depends(oauth2_scheme)) -> int:
    payload = get_payload(token)
    sub: str | None = payload.get("sub")

    if sub is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return int(sub)  # Convert back to int
