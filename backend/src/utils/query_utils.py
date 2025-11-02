from typing import List, AsyncGenerator
from src.utils.hugging_face import stream_chat
import json

def get_library_chunks(results: list) -> List[dict]:
    return [
        {
            "library_name": lib.name,
            "library_type": lib.type,
            "library_path": lib.path,
            "chunk_index": chunk.chunk_index,
            "text": chunk.chunk_text,
        }
        for chunk, lib in results
    ]

def build_context_text(chunks: List[dict]) -> str:
    return "\n\n".join([c["text"] for c in chunks])

def generate_snippets(chunks: List[dict], limit: int = 5) -> List[dict]:
    return [
        {
            "name": f"{c['library_name']} - Section {c['chunk_index'] + 1}",
            "snippet": c["text"][:300] + ("..." if len(c["text"]) > 300 else ""),
            "icon": (c["library_type"] or "text").lower(),
        }
        for c in chunks[:limit]
    ]

def generate_sources(chunks: List[dict]) -> List[dict]:
    unique = _unique_by(chunks, key=lambda x: x["library_name"])
    return [
        {
            "name": c["library_name"],
            "quote": c["text"][:150] + ("..." if len(c["text"]) > 150 else ""),
            "icon": (c["library_type"] or "text").lower(),
        }
        for c in unique
    ]

async def generate_badges(context_text: str, question: str) -> List[dict]:
    prompt = f"""
    For the following context and question,
    generate 2-3 short badges (labels) that summarize key aspects of the answer.
    Return them as a JSON array of objects with 'label' and 'icon'.
    Only pick icons from: bot, shield, waves.

    Context:
    {context_text}

    Question:
    {question}
    """

    output = ""
    async for token in stream_chat(prompt, max_tokens=150):
        output += token

    try:
        badges = json.loads(output)
        if isinstance(badges, list) and all("label" in b and "icon" in b for b in badges):
            return badges
    except json.JSONDecodeError:
        pass

    # fallback
    return [
        {"label": "AI Generated", "icon": "bot"},
        {"label": "Verified Context", "icon": "shield"},
    ]

async def stream_answer(context_text: str, question: str) -> AsyncGenerator[str, None]:
    prompt = (
        f"Answer the question using the following context:\n\n{context_text}\n\n"
        f"Question: {question}\nAnswer:"
    )

    async for token in stream_chat(prompt):
        yield token

def _unique_by(items, key):
    seen = set()
    result = []
    for item in items:
        k = key(item)
        if k not in seen:
            seen.add(k)
            result.append(item)
    return result
