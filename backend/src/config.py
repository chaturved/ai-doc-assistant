import os
from dotenv import load_dotenv

load_dotenv()

S3_ENDPOINT: str = os.getenv("S3_ENDPOINT")
S3_REGION: str = os.getenv("S3_REGION")
S3_ACCESS_KEY: str = os.getenv("S3_ACCESS_KEY")
S3_SECRET_ACCESS_KEY: str = os.getenv("S3_SECRET_ACCESS_KEY")
S3_LIBRARY_BUCKET: str = os.getenv("S3_LIBRARY_BUCKET", "library")

DATABASE_URL: str = os.getenv("DATABASE_URL")

HF_API_BASE: str = "https://api-inference.huggingface.co/models"
HF_API_KEY: str = os.getenv("HF_API_KEY")
HF_EMBEDDING_MODEL: str = os.getenv("HF_EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
HF_CHAT_MODEL = os.getenv("HF_CHAT_MODEL", "mistralai/Mistral-7B-Instruct-v0.2")

JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "supersecret")
JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")

ACCESS_TOKEN_KEY: str = os.getenv("ACCESS_TOKEN_KEY", "access_token")
ACCESS_TOKEN_TYPE: str = os.getenv("ACCESS_TOKEN_TYPE", "access")
ACCESS_TOKEN_EXPIRE_MINUTES: float = float(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

REFRESH_TOKEN_KEY: str = os.getenv("REFRESH_TOKEN_KEY", "refresh_token")
REFRESH_TOKEN_TYPE: str = os.getenv("REFRESH_TOKEN_TYPE", "refresh")
REFRESH_TOKEN_EXPIRE_DAYS: float = float(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

TEXT_CHUNK_SIZE: int = int(os.getenv("TEXT_CHUNK_SIZE", 500))
TEXT_CHUNK_OVERLAP: int = int(os.getenv("TEXT_CHUNK_OVERLAP", 50))

