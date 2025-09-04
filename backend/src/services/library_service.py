from typing import List, Dict
from fastapi import File, UploadFile
from sqlalchemy.orm import Session
from backend.src.models.library import Library


def get_library_data(db: Session, user_id: int) -> Dict:
    rows = db.query(Library).filter(Library.user_id == user_id).all()
    count = len(rows)

    # Organize by type
    sections = []
    types = set(row.type for row in rows)

    for t in types:
        items = [{"name": r.name, "size": r.size} for r in rows if r.type == t]
        sections.append({"title": t.capitalize(), "icon": t, "items": items})

    return {"count": count, "sections": sections}


async def save_files(db: Session, user_id: int, files: list[UploadFile]):
    file_records = []

    for f in files:
        # read contents to calculate size
        contents = await f.read()
        size_kb = f"{len(contents) / 1024:.0f} KB"

        file_records.append(
            Library(
                user_id=user_id,
                name=f.filename,
                size=size_kb,
                type=f.filename.split(".")[-1],
            )
        )

        f.file.seek(0)
        
    db.add_all(file_records)
    db.commit()


def clear_all(db: Session, user_id: int):
    db.query(Library).filter(Library.user_id == user_id).delete()
    db.commit()
