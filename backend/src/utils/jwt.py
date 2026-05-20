from jose import JWTError, jwt, ExpiredSignatureError
from ..config import settings
from ..core.exceptions import UnauthorizedError


def get_encoded_token(claims: dict) -> str:
    return jwt.encode(claims, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def get_payload(token: str) -> dict:
    try:
        return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except ExpiredSignatureError:
        raise UnauthorizedError("Token has expired")
    except JWTError:
        raise UnauthorizedError("Could not validate credentials")
