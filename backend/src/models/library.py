from sqlalchemy import Table, Column, Integer, String, ForeignKey
from database.db import metadata

library_table = Table(
    "library",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
    Column("name", String, nullable=False),
    Column("size", String, nullable=False),
    Column("type", String, nullable=False),
)
