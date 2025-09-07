from fastapi import UploadFile
from sqlalchemy.orm import Session

from ..models import Library, LibraryChunk
from ..utils.file_utils import save_raw_file, extract_text
from ..utils.text_utils import chunk_text
from ..utils.embedding_utils import get_embedding

def get_library_data(db: Session, user_id: int) -> dict:
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
    for f in files:
        file_path, contents = await save_raw_file(f, user_id)
        size_kb = f"{len(contents) / 1024:.0f} KB"
        ext = f.filename.split(".")[-1]

        extracted_text = extract_text(file_path, ext)

        library = Library(
            user_id=user_id,
            name=f.filename,
            type=ext,
            size=size_kb,
            path=file_path,
            extracted_text=extracted_text,
        )
        db.add(library)
        db.flush()

        chunks = chunk_text(extracted_text)
        chunk_records = []
        for i, chunk_txt in enumerate(chunks):
            embedding_vector = get_embedding(chunk_txt)
            chunk_records.append(
                LibraryChunk(
                    library_id=library.id,
                    chunk_index=i,
                    chunk_text=chunk_txt,
                    embedding=embedding_vector
                )
            )

        db.add_all(chunk_records)
        db.commit()

        f.file.seek(0)

def clear_all(db: Session, user_id: int):
    db.query(Library).filter(Library.user_id == user_id).delete()
    db.commit()
