from typing import List, Dict
from databases import Database
from models.library import library_table
from database.db import DATABASE_URL

database = Database(DATABASE_URL)

async def get_library_data(user_id: int):
    query = library_table.select().where(library_table.c.user_id == user_id)
    rows = await database.fetch_all(query)
    count = len(rows)
    
    # Organize by section type
    sections = []
    types = set([row["type"] for row in rows])
    for t in types:
        items = [{"name": r["name"], "size": r["size"]} for r in rows if r["type"] == t]
        sections.append({"title": t.capitalize(), "icon": t, "items": items})
    return {"count": count, "sections": sections}

async def save_files(user_id: int, files: List[Dict]):
    await database.connect()
    for f in files:
        query = library_table.insert().values(user_id=user_id, name=f["name"], size=f["size"], type=f["type"])
        await database.execute(query)
    await database.disconnect()

async def clear_all(user_id: int):
    await database.connect()
    query = library_table.delete().where(library_table.c.user_id == user_id)
    await database.execute(query)
    await database.disconnect()
