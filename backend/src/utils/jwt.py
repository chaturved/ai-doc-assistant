import os
from fastapi import HTTPException, status
from jose import JWTError, jwt, ExpiredSignatureError

# Secret key & algorithm
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")  # default for dev
ALGORITHM = "HS256"


def get_encoded_token(claims: dict) -> str:
    try:
        return jwt.encode(claims, SECRET_KEY, algorithm=ALGORITHM)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_payload(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
