from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from src.utils.storage_utils import delete_file, save_raw_file
from src.utils.text_utils import chunk_text, extract_text_from_bytes
from src.utils.hugging_face import get_embeddings
from src.repositories.library_repository import (
    get_libraries,
    add_library,
    add_library_chunks,
    clear_user_libraries,
    get_library_by_id,
    delete_library_item,
)
from src.models import Library, LibraryChunk


def get_library_data(db: Session, user_id: int) -> dict:
    rows = get_libraries(db, user_id)
    total_size = sum(r.size for r in rows)
    sections = [
        {
            "id": r.id,
            "name": r.name,
            "type": r.type,
            "size": r.size,
            "created_at": r.created_at,
        }
        for r in rows
    ]
    return {"count": len(rows), "total_size_bytes": total_size, "sections": sections}


async def save_files(db: Session, user_id: int, files: list[UploadFile]) -> dict:
    uploaded = []
    errors = []
    for f in files:
        try:
            file_url, contents = await save_raw_file(f, user_id)
            size_bytes = len(contents)
            ext = (f.filename or "").split(".")[-1].lower()
            extracted_text = extract_text_from_bytes(contents, ext)

            library = Library(
                user_id=user_id,
                name=f.filename,
                type=ext,
                size=size_bytes,
                path=file_url,
                extracted_text=extracted_text,
            )
            library = add_library(db, library)

            chunks = chunk_text(extracted_text)
            embeddings = await get_embeddings(chunks)

            chunk_records = [
                LibraryChunk(
                    library_id=library.id,
                    chunk_index=i,
                    chunk_text=chunk_txt,
                    embedding=emb,
                )
                for i, (chunk_txt, emb) in enumerate(zip(chunks, embeddings))
            ]
            add_library_chunks(db, chunk_records)
            f.file.seek(0)
            uploaded.append({"id": library.id, "name": library.name, "type": library.type, "size": library.size})
        except HTTPException:
            raise
        except Exception as e:
            errors.append({"file": f.filename, "error": str(e)})

    return {"uploaded": uploaded, "errors": errors}


def delete_document(db: Session, doc_id: int, user_id: int) -> dict:
    lib = get_library_by_id(db, doc_id, user_id)
    if not lib:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found")
    delete_file(lib.path)
    delete_library_item(db, lib)
    return {"message": "Document deleted"}


def clear_all(db: Session, user_id: int) -> dict:
    libraries = get_libraries(db, user_id)
    for lib in libraries:
        try:
            delete_file(lib.path)
        except Exception:
            pass
    clear_user_libraries(db, user_id)
    return {"message": "Library cleared"}
