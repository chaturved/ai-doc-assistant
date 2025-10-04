from fastapi import UploadFile
from sqlalchemy.orm import Session

from ..models import Library, LibraryChunk
from ..utils.storage_utils import delete_file, save_raw_file
from ..utils.text_utils import chunk_text, extract_text_from_bytes
from ..utils.hugging_face import get_embeddings

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
        # Save raw file
        file_url, contents = await save_raw_file(f, user_id)

        size_kb = f"{len(contents) / 1024:.0f} KB"
        ext = f.filename.split(".")[-1]

        extracted_text = extract_text_from_bytes(contents, ext)

        # Save library record
        library = Library(
            user_id=user_id,
            name=f.filename,
            type=ext,
            size=size_kb,
            path=file_url,
            extracted_text=extracted_text,
        )
        db.add(library)
        db.flush()

        # Split text into chunks
        chunks = chunk_text(extracted_text)

        # Get embeddings for all chunks at once
        embeddings = await get_embeddings(chunks)

        # Prepare LibraryChunk records
        chunk_records = [
            LibraryChunk(
                library_id=library.id,
                chunk_index=i,
                chunk_text=chunk_txt,
                embedding=emb
            )
            for i, (chunk_txt, emb) in enumerate(zip(chunks, embeddings))
        ]

        db.add_all(chunk_records)
        db.commit()

        # Reset file pointer
        f.file.seek(0)

def clear_all(db: Session, user_id: int):
    libraries = db.query(Library).filter(Library.user_id == user_id).all()

    for lib in libraries:
        delete_file(lib.path)

    db.query(LibraryChunk).filter(LibraryChunk.library_id.in_([lib.id for lib in libraries])).delete()
    db.query(Library).filter(Library.user_id == user_id).delete()
    db.commit()
