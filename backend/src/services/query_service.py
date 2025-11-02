from typing import AsyncGenerator
from fastapi import BackgroundTasks
from sqlalchemy.orm import Session
from src.repositories.library_repository import get_top_k_chunks
from src.repositories.query_repository import add_recent_query
from src.utils.hugging_face import get_embedding, stream_chat
from src.schemas.query import QuerySearchRequest

async def search_documents(
    db: Session,
    user_id: int,
    req: QuerySearchRequest,
    background_tasks: BackgroundTasks
):
    def save_query():
        add_recent_query(db, user_id, req.question)
    background_tasks.add_task(save_query)

    query_vector = await get_embedding(req.question)
    doc_id = req.filters.get("doc_id") if req.filters else None
    results = get_top_k_chunks(db, user_id, query_vector, req.top_k, doc_id)

    chunks = [
        {
            "library_name": r.name,
            "chunk_index": r.LibraryChunk.chunk_index,
            "text": r.LibraryChunk.chunk_text,
        }
        for r in results
    ]

    context_text = "\n\n".join([c["text"] for c in chunks])
    prompt = f"Answer the question using the following context:\n\n{context_text}\n\nQuestion: {req.question}\nAnswer:"

    async for token in stream_chat(prompt):
        yield token
