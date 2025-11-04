from typing import AsyncGenerator
from fastapi import BackgroundTasks
from sqlalchemy.orm import Session
from src.repositories.library_repository import get_top_k_chunks
from src.repositories.query_repository import add_recent_query
from src.schemas.query import QuerySearchRequest
from src.utils.hugging_face import get_embedding
from src.utils.query_utils import (
    get_library_chunks,
    build_context_text,
    generate_snippets,
    generate_sources,
    generate_description_and_badges,
    stream_answer
)

async def ask_question(
    db: Session,
    user_id: int,
    req: QuerySearchRequest,
    background_tasks: BackgroundTasks
) -> AsyncGenerator[tuple[str, dict | str], None]:
    background_tasks.add_task(add_recent_query, db, user_id, req.question)

    query_vector = await get_embedding(req.question)
    doc_id = req.filters.get("doc_id") if req.filters else None
    results = get_top_k_chunks(db, user_id, query_vector, req.top_k, doc_id)

    chunks = get_library_chunks(results)
    context_text = build_context_text(chunks)

    description, badges = await generate_description_and_badges(chunks, req.question)

    meta = {
        "description": description,
        "badges": badges,
        "snippets": generate_snippets(chunks),
        "sources": generate_sources(chunks),
    }

    yield "meta", meta

    async for token in stream_answer(context_text, req.question):
        yield "token", token
