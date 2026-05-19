from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from .api import router
from .config import ALLOWED_ORIGINS, JWT_SECRET_KEY

app = FastAPI(title="Paperwise API")

app.add_middleware(SessionMiddleware, secret_key=JWT_SECRET_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
