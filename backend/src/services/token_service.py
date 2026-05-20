from datetime import timedelta, datetime, timezone

from ..config import settings
from ..core.exceptions import UnauthorizedError
from ..utils.jwt import get_encoded_token, get_payload


def _create_token(user_id: int, expires_delta: timedelta, token_type: str) -> str:
    expire = datetime.now(timezone.utc) + expires_delta
    claims = {"sub": str(user_id), "exp": int(expire.timestamp()), "type": token_type}
    return get_encoded_token(claims)


def create_access_token(user_id: int) -> str:
    return _create_token(
        user_id,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        token_type=settings.ACCESS_TOKEN_TYPE,
    )


def create_refresh_token(user_id: int) -> str:
    return _create_token(
        user_id,
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        token_type=settings.REFRESH_TOKEN_TYPE,
    )


def _validate_token(token: str, expected_type: str) -> int:
    payload = get_payload(token)
    if payload.get("type") != expected_type:
        raise UnauthorizedError("Invalid token type")
    user_id = payload.get("sub")
    if user_id is None:
        raise UnauthorizedError("Invalid authentication token")
    return int(user_id)


def validate_access_token(token: str) -> int:
    return _validate_token(token, settings.ACCESS_TOKEN_TYPE)


def validate_refresh_token(token: str) -> int:
    return _validate_token(token, settings.REFRESH_TOKEN_TYPE)
