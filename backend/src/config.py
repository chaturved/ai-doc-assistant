from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    S3_ENDPOINT: str = ""
    S3_REGION: str = ""
    S3_ACCESS_KEY: str = ""
    S3_SECRET_ACCESS_KEY: str = ""
    S3_LIBRARY_BUCKET: str = "library"

    DATABASE_URL: str = ""

    HF_API_BASE: str = "https://api-inference.huggingface.co/models"
    HF_API_KEY: str = ""
    HF_EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    HF_CHAT_MODEL: str = "mistralai/Mistral-7B-Instruct-v0.2"

    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/google/callback"

    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_NAME: str = "Paperwise"
    SMTP_FROM_EMAIL: str = "noreply@paperwise.ai"

    APP_URL: str = "http://localhost:3001"

    JWT_SECRET_KEY: str = "supersecret"
    JWT_ALGORITHM: str = "HS256"

    ACCESS_TOKEN_KEY: str = "access_token"
    ACCESS_TOKEN_TYPE: str = "access"
    ACCESS_TOKEN_EXPIRE_MINUTES: float = 60.0

    REFRESH_TOKEN_KEY: str = "refresh_token"
    REFRESH_TOKEN_TYPE: str = "refresh"
    REFRESH_TOKEN_EXPIRE_DAYS: float = 7.0

    TEXT_CHUNK_SIZE: int = 500
    TEXT_CHUNK_OVERLAP: int = 50

    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:3001"]


settings = Settings()

# Module-level aliases for backward-compatible imports (from ..config import X)
S3_ENDPOINT = settings.S3_ENDPOINT
S3_REGION = settings.S3_REGION
S3_ACCESS_KEY = settings.S3_ACCESS_KEY
S3_SECRET_ACCESS_KEY = settings.S3_SECRET_ACCESS_KEY
S3_LIBRARY_BUCKET = settings.S3_LIBRARY_BUCKET

DATABASE_URL = settings.DATABASE_URL

HF_API_BASE = settings.HF_API_BASE
HF_API_KEY = settings.HF_API_KEY
HF_EMBEDDING_MODEL = settings.HF_EMBEDDING_MODEL
HF_CHAT_MODEL = settings.HF_CHAT_MODEL

GOOGLE_CLIENT_ID = settings.GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET = settings.GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI = settings.GOOGLE_REDIRECT_URI

SMTP_HOST = settings.SMTP_HOST
SMTP_PORT = settings.SMTP_PORT
SMTP_USER = settings.SMTP_USER
SMTP_PASSWORD = settings.SMTP_PASSWORD
SMTP_FROM_NAME = settings.SMTP_FROM_NAME
SMTP_FROM_EMAIL = settings.SMTP_FROM_EMAIL

APP_URL = settings.APP_URL

JWT_SECRET_KEY = settings.JWT_SECRET_KEY
JWT_ALGORITHM = settings.JWT_ALGORITHM

ACCESS_TOKEN_KEY = settings.ACCESS_TOKEN_KEY
ACCESS_TOKEN_TYPE = settings.ACCESS_TOKEN_TYPE
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

REFRESH_TOKEN_KEY = settings.REFRESH_TOKEN_KEY
REFRESH_TOKEN_TYPE = settings.REFRESH_TOKEN_TYPE
REFRESH_TOKEN_EXPIRE_DAYS = settings.REFRESH_TOKEN_EXPIRE_DAYS

TEXT_CHUNK_SIZE = settings.TEXT_CHUNK_SIZE
TEXT_CHUNK_OVERLAP = settings.TEXT_CHUNK_OVERLAP

ALLOWED_ORIGINS = settings.ALLOWED_ORIGINS
