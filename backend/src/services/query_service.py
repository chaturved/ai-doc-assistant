from sqlalchemy.orm import Session
from typing import List, Dict
from ..schemas.query import QuerySearchRequest
from ..models import LibraryChunk, Library, RecentQuery
from ..utils.hugging_face import get_embedding, get_chat_completion

async def search_documents(
    db: Session, 
    user_id: int, 
    request: QuerySearchRequest
) -> Dict:
    query_vector = await get_embedding(request.query)

    q = (
        db.query(LibraryChunk, Library.name)
        .join(Library, LibraryChunk.library_id == Library.id)
        .filter(Library.user_id == user_id)
    )

    if request.filters:
        for field, value in request.filters.items():
            if hasattr(LibraryChunk, field):
                q = q.filter(getattr(LibraryChunk, field) == value)

    results = (
        q.order_by(LibraryChunk.embedding.cosine_distance(query_vector))
        .limit(request.top_k)
        .all()
    )

    chunks = [
        {
            "library_name": lib_name,
            "chunk_index": chunk.chunk_index,
            "doc_id": getattr(chunk, "doc_id", None),
            "text": chunk.chunk_text,
        }
        for chunk, lib_name in results
    ]

    context_text = "\n\n".join([c["text"] for c in chunks])
    messages = [
        {"role": "system", "content": "You are a helpful assistant. Use the context to answer."},
        {"role": "user", "content": f"Context:\n{context_text}\n\nQuestion: {request.query}"}
    ]

    answer = await get_chat_completion(messages)

    db.add(RecentQuery(user_id=user_id, query=request.query))
    db.commit()

    return {
        "query": request.query,
        "results": chunks,
        "answer": answer,
    }

def get_recent_queries(db: Session, user_id: int, limit: int = 5) -> List[Dict]:
    queries = (
        db.query(RecentQuery)
        .filter(RecentQuery.user_id == user_id)
        .order_by(RecentQuery.created_at.desc())
        .limit(limit)
        .all()
    )
    return [{"query": q.query, "created_at": q.created_at} for q in queries]

async def get_related_queries(db: Session, user_id: int, query: str, top_k: int = 5) -> List[Dict]:
    query_vector = await get_embedding(query)
    recent_queries = db.query(RecentQuery).filter(RecentQuery.user_id == user_id).all()

    related = []
    for rq in recent_queries:
        rq_vector = await get_embedding(rq.query)
        similarity = sum(a * b for a, b in zip(query_vector, rq_vector))  # dot product
        related.append({"query": rq.query, "similarity": similarity})

    return sorted(related, key=lambda x: x["similarity"], reverse=True)[:top_k]

def get_search_tips() -> List[str]:
    return [
        "Use specific keywords for better search results.",
        "Try breaking down long queries into smaller parts.",
        "Recent documents are prioritized in results.",
        "Check the sources section for exact references.",
    ]
