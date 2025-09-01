from typing import List, Dict
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


def save_files(db: Session, user_id: int, files: List[Dict]):
    for f in files:
        db.add(
            Library(
                user_id=user_id,
                name=f["name"],
                size=f["size"],
                type=f["type"],
            )
        )
    db.commit()


def clear_all(db: Session, user_id: int):
    db.query(Library).filter(Library.user_id == user_id).delete()
    db.commit()
