from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api import library
from database.db import engine, metadata

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables if not exist
metadata.create_all(engine)

# Register routes
app.include_router(library.router)
