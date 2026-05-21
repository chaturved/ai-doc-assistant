# Tier Limits Enforcement — Design Spec

**Date:** 2026-05-21
**Project:** Paperwise backend
**Scope:** Enforce Free/Pro tier limits at the three enforcement points defined in SPEC.md §13

---

## Background

The User model already has a `plan` field (`"free"` | `"pro"`). No enforcement exists anywhere in the backend. This spec adds it.

---

## Tier Constants

```python
LIMITS = {
    "free": {
        "max_docs":        5,
        "max_file_mb":     10,
        "allowed_types":   ["pdf", "txt", "md"],
        "max_queries_day": 20,
        "history_days":    7,
    },
    "pro": {
        "max_docs":        None,   # unlimited
        "max_file_mb":     50,
        "allowed_types":   ["pdf", "docx", "txt", "md"],
        "max_queries_day": None,   # unlimited
        "history_days":    None,   # forever
    },
}
```

---

## New Model: `QueryUsageLog`

Table: `query_usage_log`

| Column     | Type      | Notes                  |
|------------|-----------|------------------------|
| id         | Integer   | PK, autoincrement      |
| user_id    | Integer   | FK → users.id, indexed |
| created_at | DateTime  | UTC, server default    |

One row inserted per `/ask` call that passes quota checks. Rolling 24h count = `COUNT(*) WHERE user_id = ? AND created_at > now() - '24 hours'`. Old rows can be pruned periodically (optional).

Migration: `0005_query_usage_log.py`

---

## New: `PlanLimitError` Exception

Added to `backend/src/core/exceptions.py`:

```python
class PlanLimitError(AppError):
    status_code = 402

    def __init__(self, limit: str):
        super().__init__(
            message="Plan limit exceeded",
            code="LIMIT_EXCEEDED",
            status_code=402,
        )
        self.limit = limit
```

The existing exception handler serializes it as:
```json
{
  "error": {
    "code": "LIMIT_EXCEEDED",
    "limit": "documents",
    "upgrade_url": "/settings/billing"
  }
}
```

The `upgrade_url` is added by the exception handler, not stored on the error object.

---

## New: `TierService`

File: `backend/src/services/tier_service.py`

Centralizes all quota logic. Stateless — takes data as arguments, raises `PlanLimitError` on violation.

### Methods

**`get_limits(plan: str) -> dict`**
Returns the constants dict for the given plan.

**`check_upload(plan: str, files: list[UploadFile], current_doc_count: int) -> None`**
- If `max_docs` is set and `current_doc_count + len(files) > max_docs` → raise `PlanLimitError("documents")`
- For each file: if `file.size > max_file_mb * 1024 * 1024` → raise `PlanLimitError("file_size")`
- For each file: if extension not in `allowed_types` → raise `PlanLimitError("file_type")`

**`check_ask(plan: str, query_count_24h: int) -> None`**
- If `max_queries_day` is set and `query_count_24h >= max_queries_day` → raise `PlanLimitError("queries")`

**`check_history(plan: str, conversation_age_days: float) -> None`**
- If `history_days` is set and `conversation_age_days > history_days` → raise `PlanLimitError("history")`

**`count_queries_24h(user_id: int, db: Session) -> int`**
- `SELECT COUNT(*) FROM query_usage_log WHERE user_id = ? AND created_at > now() - interval '24 hours'`

**`log_query(user_id: int, db: Session) -> None`**
- Inserts one row into `query_usage_log` and commits.

---

## New: `get_current_user` Dependency

Added to `backend/src/core/dependencies.py`:

```python
async def get_current_user(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> User:
    user = db.get(User, user_id)
    if not user:
        raise UnauthorizedError()
    return user
```

Returns the full ORM `User` object (not just id). Used by all tier-limit guards.

---

## Enforcement Points

### 1. Upload (`POST /library/upload`)

In `backend/src/api/v1/library.py`:

```python
@router.post("/upload")
async def upload(
    files: list[UploadFile],
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    library_service: ILibraryService = Depends(...),
    tier_service: TierService = Depends(...),
):
    current_count = db.scalar(select(func.count()).where(Library.user_id == user.id))
    tier_service.check_upload(user.plan, files, current_count)
    return await library_service.save_files(user.id, files, db)
```

### 2. Ask (`POST /conversations/{id}/ask`)

In `backend/src/api/v1/conversations.py`:

```python
@router.post("/{conv_id}/ask")
async def ask(
    conv_id: int,
    body: AskRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    conversation_service: IConversationService = Depends(...),
    tier_service: TierService = Depends(...),
):
    # History gate
    conv = db.get(Conversation, conv_id)
    age_days = (datetime.utcnow() - conv.created_at).days
    tier_service.check_history(user.plan, age_days)

    # Daily query gate
    count = tier_service.count_queries_24h(user.id, db)
    tier_service.check_ask(user.plan, count)

    # Log the query
    tier_service.log_query(user.id, db)

    return StreamingResponse(
        conversation_service.ask(conv_id, user.id, body, db),
        media_type="text/event-stream",
    )
```

### 3. History (`GET /conversations/{id}/messages`)

Conversation age check is folded into the `/ask` endpoint above (same route hits history). If there is also a separate `GET /conversations/{id}/messages` endpoint, the same `check_history` call is added there.

---

## Error Response Format

All `PlanLimitError` exceptions are caught by the global exception handler and serialized as:

```json
HTTP 402 Payment Required
{
  "error": {
    "code": "LIMIT_EXCEEDED",
    "limit": "documents",
    "upgrade_url": "/settings/billing"
  }
}
```

The `limit` field values: `"documents"`, `"file_size"`, `"file_type"`, `"queries"`, `"history"`.

---

## Files to Create

| File | Purpose |
|---|---|
| `backend/src/models/query_usage_log.py` | New ORM model |
| `backend/src/services/tier_service.py` | TierService class + Protocol |
| `backend/alembic/versions/0005_query_usage_log.py` | Migration |

## Files to Modify

| File | Change |
|---|---|
| `backend/src/core/exceptions.py` | Add `PlanLimitError` |
| `backend/src/core/dependencies.py` | Add `get_current_user()` |
| `backend/src/api/v1/library.py` | Add upload enforcement |
| `backend/src/api/v1/conversations.py` | Add ask + history enforcement |
| `backend/src/models/__init__.py` | Export new model |

---

## Out of Scope

- Stripe payment integration (v2)
- Usage dashboard / remaining quota endpoint
- Automated cleanup of old `query_usage_log` rows
