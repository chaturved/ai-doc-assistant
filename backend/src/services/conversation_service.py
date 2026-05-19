import json
from typing import AsyncGenerator
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.repositories.conversation_repository import (
    add_message,
    create_conversation,
    delete_conversation,
    get_conversation,
    get_conversations,
    get_messages,
    get_recent_messages,
    touch_conversation,
    update_conversation_title,
)
from src.repositories.library_repository import get_top_k_chunks
from src.utils.hugging_face import get_embedding
from src.utils.query_utils import (
    build_context_text,
    generate_description_and_badges,
    generate_snippets,
    generate_sources,
    get_library_chunks,
    stream_answer,
)


def list_conversations(db: Session, user_id: int) -> list:
    convs = get_conversations(db, user_id)
    return [
        {
            "id": c.id,
            "title": c.title,
            "created_at": c.created_at,
            "updated_at": c.updated_at,
        }
        for c in convs
    ]


def new_conversation(db: Session, user_id: int, title: str = "New conversation") -> dict:
    conv = create_conversation(db, user_id, title)
    return {"id": conv.id, "title": conv.title, "created_at": conv.created_at}


def rename_conversation(db: Session, conv_id: int, user_id: int, title: str) -> dict:
    conv = get_conversation(db, conv_id, user_id)
    if not conv:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Conversation not found")
    conv = update_conversation_title(db, conv, title)
    return {"id": conv.id, "title": conv.title, "updated_at": conv.updated_at}


def remove_conversation(db: Session, conv_id: int, user_id: int) -> dict:
    conv = get_conversation(db, conv_id, user_id)
    if not conv:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Conversation not found")
    delete_conversation(db, conv)
    return {"message": "Conversation deleted"}


def list_messages(db: Session, conv_id: int, user_id: int) -> list:
    conv = get_conversation(db, conv_id, user_id)
    if not conv:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Conversation not found")
    msgs = get_messages(db, conv_id)
    return [
        {"id": m.id, "role": m.role, "content": m.content, "meta": m.meta, "created_at": m.created_at}
        for m in msgs
    ]


def _build_history_prompt(prior_messages: list) -> str:
    parts = []
    for m in prior_messages:
        if m.role == "user":
            parts.append(f"[INST] {m.content} [/INST]")
        else:
            parts.append(m.content)
    return "\n".join(parts)


async def ask(
    db: Session,
    conv_id: int,
    user_id: int,
    question: str,
    filters: dict | None,
    top_k: int,
) -> AsyncGenerator[tuple[str, dict | str], None]:
    conv = get_conversation(db, conv_id, user_id)
    if not conv:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Conversation not found")

    # Save user message
    add_message(db, conv_id, "user", question)

    # Retrieve context
    query_vector = await get_embedding(question)
    doc_id = filters.get("doc_id") if filters else None
    results = get_top_k_chunks(db, user_id, query_vector, top_k, doc_id)
    chunks = get_library_chunks(results)
    context_text = build_context_text(chunks)

    description, badges = await generate_description_and_badges(chunks, question)
    meta = {
        "description": description,
        "badges": badges,
        "snippets": generate_snippets(chunks),
        "sources": generate_sources(chunks),
    }

    yield "meta", meta

    # Stream answer, accumulate
    full_answer = ""
    async for token in stream_answer(context_text, question):
        full_answer += token
        yield "token", token

    # Save assistant message
    add_message(db, conv_id, "assistant", full_answer, meta)

    # Auto-title if still default
    if conv.title == "New conversation":
        short_q = question[:60] + ("…" if len(question) > 60 else "")
        update_conversation_title(db, conv, short_q)
    else:
        touch_conversation(db, conv)
