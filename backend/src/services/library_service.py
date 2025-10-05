from fastapi import UploadFile
from sqlalchemy.orm import Session
from src.utils.storage_utils import delete_file, save_raw_file
from src.utils.text_utils import chunk_text, extract_text_from_bytes
from src.utils.hugging_face import get_embeddings
from src.repositories.library_repository import (
    get_libraries,
    add_library,
    add_library_chunks,
    clear_user_libraries
)
from src.models import Library, LibraryChunk

def get_library_data(db: Session, user_id: int) -> dict:
    rows = get_libraries(db, user_id)
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
        library = add_library(db, library)

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

        add_library_chunks(db, chunk_records)

        # Reset file pointer
        f.file.seek(0)

def clear_all(db: Session, user_id: int):
    libraries = get_libraries(db, user_id)
    for lib in libraries:
        delete_file(lib.path)

    clear_user_libraries(db, user_id)
