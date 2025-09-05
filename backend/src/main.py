from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth, library
from .database.db import engine
from .models.user import Base

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router)
app.include_router(library.router)
