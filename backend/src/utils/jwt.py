from fastapi import HTTPException, status
from jose import JWTError, jwt, ExpiredSignatureError
from ..config import JWT_SECRET_KEY, JWT_ALGORITHM


def get_encoded_token(claims: dict) -> str:
    try:
        return jwt.encode(claims, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create token",
        )


def get_payload(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_SECRET_KEY])
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
