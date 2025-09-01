from sqlalchemy import Table, Column, Integer, String
from database.db import metadata

user_table = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("email", String, unique=True, nullable=False),
    Column("name", String, nullable=True),
)
