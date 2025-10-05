from typing import List, Optional
from requests import Session

from src.models.library import Library
from src.models.library_chunk import LibraryChunk

from typing import List
from sqlalchemy.orm import Session
from src.models import Library, LibraryChunk

def get_libraries(db: Session, user_id: int) -> List[Library]:
    return db.query(Library).filter(Library.user_id == user_id).all()

def add_library(db: Session, library: Library) -> Library:
    db.add(library)
    db.flush()  # flush to get library.id
    return library

def add_library_chunks(db: Session, chunks: List[LibraryChunk]):
    db.add_all(chunks)
    db.commit()

def clear_user_libraries(db: Session, user_id: int):
    libraries = db.query(Library).filter(Library.user_id == user_id).all()
    library_ids = [lib.id for lib in libraries]

    db.query(LibraryChunk).filter(LibraryChunk.library_id.in_(library_ids)).delete(synchronize_session=False)
    db.query(Library).filter(Library.user_id == user_id).delete(synchronize_session=False)
    db.commit()

def get_top_k_chunks(
    db: Session,
    user_id: int,
    query_vector: list[float],
    top_k: int = 5,
    doc_id: Optional[str] = None
) -> List:
    q = (
        db.query(LibraryChunk, Library.name)
        .join(Library, LibraryChunk.library_id == Library.id)
        .filter(Library.user_id == user_id)
    )

    if doc_id:
        q = q.filter(Library.id == doc_id)

    return (
        q.order_by(LibraryChunk.embedding.cosine_distance(query_vector))
        .limit(top_k)
        .all()
    )