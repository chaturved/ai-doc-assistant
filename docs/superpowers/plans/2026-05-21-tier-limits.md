# Tier Limits Enforcement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce Free/Pro tier limits (document count, file size, file type, daily query count, conversation history age) at three enforcement points in the FastAPI backend.

**Architecture:** A new `TierService` owns all quota constants and check logic. A `QueryUsageLog` model records each ask. Three FastAPI endpoint handlers are updated to call `TierService` before processing. A new `get_current_user` dependency returns the full `User` ORM object needed for plan checks.

**Tech Stack:** FastAPI, SQLAlchemy, Alembic, pytest, Python 3.11+

---

## File Map

| Action | Path | Purpose |
|---|---|---|
| Create | `backend/src/core/exceptions.py` | Add `PlanLimitError` |
| Modify | `backend/src/main.py` | Add `PlanLimitError` exception handler |
| Create | `backend/src/models/query_usage_log.py` | ORM model for usage tracking |
| Modify | `backend/src/models/__init__.py` | Export `QueryUsageLog` |
| Create | `backend/alembic/versions/0005_query_usage_log.py` | Migration |
| Create | `backend/src/services/tier_service.py` | All quota logic |
| Modify | `backend/src/core/dependencies.py` | Add `get_current_user` + `get_tier_service` |
| Modify | `backend/src/api/v1/library.py` | Upload enforcement |
| Modify | `backend/src/api/v1/conversations.py` | Ask + history enforcement |
| Create | `backend/tests/__init__.py` | Test package |
| Create | `backend/tests/test_tier_service.py` | Unit tests for TierService |

---

## Task 1: `PlanLimitError` exception + handler

**Files:**
- Modify: `backend/src/core/exceptions.py`
- Modify: `backend/src/main.py`

- [ ] **Step 1: Write the failing test**

Create `backend/tests/__init__.py` (empty) and `backend/tests/test_tier_service.py`:

```python
# backend/tests/test_tier_service.py
import pytest
from src.core.exceptions import PlanLimitError


def test_plan_limit_error_has_correct_status():
    err = PlanLimitError("documents")
    assert err.status_code == 402
    assert err.limit == "documents"
    assert err.code == "LIMIT_EXCEEDED"
```

- [ ] **Step 2: Run to confirm it fails**

```bash
cd backend && python -m pytest tests/test_tier_service.py::test_plan_limit_error_has_correct_status -v
```

Expected: `ImportError` or `AttributeError` — `PlanLimitError` doesn't exist yet.

- [ ] **Step 3: Add `PlanLimitError` to exceptions.py**

Append to `backend/src/core/exceptions.py`:

```python
class PlanLimitError(AppError):
    def __init__(self, limit: str, message: str = "Plan limit exceeded"):
        super().__init__(message, "LIMIT_EXCEEDED", 402)
        self.limit = limit
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
cd backend && python -m pytest tests/test_tier_service.py::test_plan_limit_error_has_correct_status -v
```

Expected: PASS.

- [ ] **Step 5: Add the dedicated exception handler in `main.py`**

The existing `AppError` handler returns `{"error": exc.message, "code": exc.code}`. `PlanLimitError` needs the spec format: `{"error": {"code": "LIMIT_EXCEEDED", "limit": "...", "upgrade_url": "/settings/billing"}}`. Add a specific handler **before** the generic `AppError` handler (FastAPI matches most-specific first):

In `backend/src/main.py`, after the imports add `PlanLimitError` to the import line:

```python
from .core.exceptions import AppError, PlanLimitError
```

Then add this handler before the existing `app_error_handler`:

```python
@app.exception_handler(PlanLimitError)
async def plan_limit_error_handler(request: Request, exc: PlanLimitError) -> JSONResponse:
    return JSONResponse(
        status_code=402,
        content={
            "error": {
                "code": "LIMIT_EXCEEDED",
                "limit": exc.limit,
                "upgrade_url": "/settings/billing",
            }
        },
    )
```

- [ ] **Step 6: Commit**

```bash
cd backend && git add src/core/exceptions.py src/main.py tests/__init__.py tests/test_tier_service.py
git commit -m "feat: add PlanLimitError exception and 402 handler"
```

---

## Task 2: `QueryUsageLog` model

**Files:**
- Create: `backend/src/models/query_usage_log.py`
- Modify: `backend/src/models/__init__.py`

- [ ] **Step 1: Create the model**

```python
# backend/src/models/query_usage_log.py
from sqlalchemy import Column, DateTime, ForeignKey, Integer, func
from sqlalchemy.orm import relationship

from ..database.db import Base


class QueryUsageLog(Base):
    __tablename__ = "query_usage_log"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="query_usage_logs")
```

- [ ] **Step 2: Add the relationship to `User`**

In `backend/src/models/user.py`, add one line to the relationships at the bottom of the `User` class:

```python
    query_usage_logs = relationship("QueryUsageLog", back_populates="user", cascade="all, delete-orphan")
```

- [ ] **Step 3: Export from `__init__.py`**

In `backend/src/models/__init__.py`, add:

```python
from .query_usage_log import QueryUsageLog
```

- [ ] **Step 4: Commit**

```bash
cd backend && git add src/models/query_usage_log.py src/models/__init__.py src/models/user.py
git commit -m "feat: add QueryUsageLog model"
```

---

## Task 3: Alembic migration

**Files:**
- Create: `backend/alembic/versions/0005_query_usage_log.py`

- [ ] **Step 1: Create the migration file**

```python
# backend/alembic/versions/0005_query_usage_log.py
"""add query_usage_log table

Revision ID: 0005
Revises: 0004_waitlist
Create Date: 2026-05-21
"""
from alembic import op
import sqlalchemy as sa

revision = "0005"
down_revision = "0004_waitlist"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "query_usage_log",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_query_usage_log_user_id", "query_usage_log", ["user_id"])


def downgrade() -> None:
    op.drop_index("ix_query_usage_log_user_id", "query_usage_log")
    op.drop_table("query_usage_log")
```

- [ ] **Step 2: Verify the migration chain is unbroken**

```bash
cd backend && python -c "
from alembic.config import Config
from alembic.script import ScriptDirectory
cfg = Config('alembic.ini')
sd = ScriptDirectory.from_config(cfg)
for rev in sd.walk_revisions():
    print(rev.revision, '->', rev.down_revision)
"
```

Expected: `0005` appears in the list with `down_revision = '0004_waitlist'`. No errors.

- [ ] **Step 3: Commit**

```bash
cd backend && git add alembic/versions/0005_query_usage_log.py
git commit -m "feat: migration 0005 — add query_usage_log table"
```

---

## Task 4: `TierService`

**Files:**
- Create: `backend/src/services/tier_service.py`
- Modify: `backend/tests/test_tier_service.py`

- [ ] **Step 1: Write all unit tests first**

Replace the contents of `backend/tests/test_tier_service.py`:

```python
import pytest
from unittest.mock import MagicMock
from datetime import datetime, timedelta

from src.core.exceptions import PlanLimitError
from src.services.tier_service import TierService


@pytest.fixture
def svc():
    return TierService()


# ── check_upload ──────────────────────────────────────────────────────────────

def test_upload_free_doc_limit(svc):
    files = [MagicMock(filename="a.pdf", size=1024)]
    with pytest.raises(PlanLimitError) as exc:
        svc.check_upload("free", files, current_doc_count=5)
    assert exc.value.limit == "documents"


def test_upload_free_doc_limit_not_exceeded(svc):
    files = [MagicMock(filename="a.pdf", size=1024)]
    svc.check_upload("free", files, current_doc_count=4)  # 4 + 1 = 5, exactly at limit — ok


def test_upload_free_file_too_large(svc):
    files = [MagicMock(filename="a.pdf", size=11 * 1024 * 1024)]  # 11MB
    with pytest.raises(PlanLimitError) as exc:
        svc.check_upload("free", files, current_doc_count=0)
    assert exc.value.limit == "file_size"


def test_upload_free_disallowed_type(svc):
    files = [MagicMock(filename="report.docx", size=1024)]
    with pytest.raises(PlanLimitError) as exc:
        svc.check_upload("free", files, current_doc_count=0)
    assert exc.value.limit == "file_type"


def test_upload_pro_no_doc_limit(svc):
    files = [MagicMock(filename="a.pdf", size=1024)]
    svc.check_upload("pro", files, current_doc_count=1000)  # no limit for pro


def test_upload_pro_allows_docx(svc):
    files = [MagicMock(filename="report.docx", size=1024)]
    svc.check_upload("pro", files, current_doc_count=0)  # no error


def test_upload_pro_file_size_limit(svc):
    files = [MagicMock(filename="big.pdf", size=51 * 1024 * 1024)]  # 51MB
    with pytest.raises(PlanLimitError) as exc:
        svc.check_upload("pro", files, current_doc_count=0)
    assert exc.value.limit == "file_size"


# ── check_ask ─────────────────────────────────────────────────────────────────

def test_ask_free_at_limit(svc):
    with pytest.raises(PlanLimitError) as exc:
        svc.check_ask("free", query_count_24h=20)
    assert exc.value.limit == "queries"


def test_ask_free_under_limit(svc):
    svc.check_ask("free", query_count_24h=19)  # no error


def test_ask_pro_no_limit(svc):
    svc.check_ask("pro", query_count_24h=10000)  # no error


# ── check_history ─────────────────────────────────────────────────────────────

def test_history_free_too_old(svc):
    with pytest.raises(PlanLimitError) as exc:
        svc.check_history("free", conversation_age_days=8)
    assert exc.value.limit == "history"


def test_history_free_within_limit(svc):
    svc.check_history("free", conversation_age_days=7)  # exactly 7 days — ok


def test_history_pro_any_age(svc):
    svc.check_history("pro", conversation_age_days=365)  # no error


# ── count_queries_24h ─────────────────────────────────────────────────────────

def test_count_queries_calls_db(svc):
    db = MagicMock()
    db.scalar.return_value = 5
    count = svc.count_queries_24h(user_id=1, db=db)
    assert count == 5
    db.scalar.assert_called_once()


# ── log_query ─────────────────────────────────────────────────────────────────

def test_log_query_inserts_and_commits(svc):
    db = MagicMock()
    svc.log_query(user_id=1, db=db)
    db.add.assert_called_once()
    db.commit.assert_called_once()
```

- [ ] **Step 2: Run tests to confirm they all fail**

```bash
cd backend && python -m pytest tests/test_tier_service.py -v
```

Expected: All fail with `ImportError` — `TierService` doesn't exist yet.

- [ ] **Step 3: Implement `TierService`**

Create `backend/src/services/tier_service.py`:

```python
from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.core.exceptions import PlanLimitError
from src.models.query_usage_log import QueryUsageLog

LIMITS: dict[str, dict] = {
    "free": {
        "max_docs": 5,
        "max_file_mb": 10,
        "allowed_types": {"pdf", "txt", "md"},
        "max_queries_day": 20,
        "history_days": 7,
    },
    "pro": {
        "max_docs": None,
        "max_file_mb": 50,
        "allowed_types": {"pdf", "docx", "txt", "md"},
        "max_queries_day": None,
        "history_days": None,
    },
}


class TierService:
    def _limits(self, plan: str) -> dict:
        return LIMITS.get(plan, LIMITS["free"])

    def check_upload(self, plan: str, files: list, current_doc_count: int) -> None:
        limits = self._limits(plan)
        if limits["max_docs"] is not None and current_doc_count + len(files) > limits["max_docs"]:
            raise PlanLimitError("documents")
        max_bytes = limits["max_file_mb"] * 1024 * 1024
        for f in files:
            size = getattr(f, "size", None) or 0
            if size > max_bytes:
                raise PlanLimitError("file_size")
            ext = f.filename.rsplit(".", 1)[-1].lower() if "." in f.filename else ""
            if ext not in limits["allowed_types"]:
                raise PlanLimitError("file_type")

    def check_ask(self, plan: str, query_count_24h: int) -> None:
        limits = self._limits(plan)
        if limits["max_queries_day"] is not None and query_count_24h >= limits["max_queries_day"]:
            raise PlanLimitError("queries")

    def check_history(self, plan: str, conversation_age_days: float) -> None:
        limits = self._limits(plan)
        if limits["history_days"] is not None and conversation_age_days > limits["history_days"]:
            raise PlanLimitError("history")

    def count_queries_24h(self, user_id: int, db: Session) -> int:
        cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
        stmt = select(func.count()).where(
            QueryUsageLog.user_id == user_id,
            QueryUsageLog.created_at >= cutoff,
        )
        return db.scalar(stmt) or 0

    def log_query(self, user_id: int, db: Session) -> None:
        db.add(QueryUsageLog(user_id=user_id))
        db.commit()
```

- [ ] **Step 4: Run all tests and confirm they pass**

```bash
cd backend && python -m pytest tests/test_tier_service.py -v
```

Expected: All 16 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd backend && git add src/services/tier_service.py tests/test_tier_service.py
git commit -m "feat: implement TierService with full unit test coverage"
```

---

## Task 5: `get_current_user` dependency + `get_tier_service`

**Files:**
- Modify: `backend/src/core/dependencies.py`

- [ ] **Step 1: Add the two new dependencies**

In `backend/src/core/dependencies.py`, add these imports at the top:

```python
from sqlalchemy.orm import Session
from src.models.user import User
```

Then add after the existing `get_current_user_id` function:

```python
def get_current_user(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> User:
    user = db.get(User, user_id)
    if not user:
        raise UnauthorizedError()
    return user
```

And add the tier service factory at the bottom (alongside the other service factories):

```python
from src.services.tier_service import TierService
get_tier_service = TierService
```

- [ ] **Step 2: Verify the import chain resolves without errors**

```bash
cd backend && python -c "from src.core.dependencies import get_current_user, get_tier_service; print('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
cd backend && git add src/core/dependencies.py
git commit -m "feat: add get_current_user and get_tier_service dependencies"
```

---

## Task 6: Enforce limits on upload endpoint

**Files:**
- Modify: `backend/src/api/v1/library.py`

- [ ] **Step 1: Update the upload endpoint**

Replace the contents of `backend/src/api/v1/library.py`:

```python
from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.core.dependencies import get_current_user, get_current_user_id, get_db, get_library_service, get_tier_service
from src.models.library import Library
from src.models.user import User
from src.services.library_service import ILibraryService
from src.services.tier_service import TierService

router = APIRouter(prefix="/library", tags=["Library"])


@router.get("")
def fetch_library(
    user_id: int = Depends(get_current_user_id),
    service: ILibraryService = Depends(get_library_service),
):
    return service.get_library_data(user_id)


@router.post("/upload")
async def upload_library(
    files: list[UploadFile] = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    service: ILibraryService = Depends(get_library_service),
    tier: TierService = Depends(get_tier_service),
):
    current_count = db.scalar(select(func.count()).where(Library.user_id == user.id)) or 0
    tier.check_upload(user.plan, files, current_count)
    return await service.save_files(user.id, files)


@router.delete("/clear")
def clear_library(
    user_id: int = Depends(get_current_user_id),
    service: ILibraryService = Depends(get_library_service),
):
    return service.clear_all(user_id)


@router.delete("/{doc_id}")
def delete_doc(
    doc_id: int,
    user_id: int = Depends(get_current_user_id),
    service: ILibraryService = Depends(get_library_service),
):
    return service.delete_document(doc_id, user_id)
```

- [ ] **Step 2: Verify import resolution**

```bash
cd backend && python -c "from src.api.v1.library import router; print('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
cd backend && git add src/api/v1/library.py
git commit -m "feat: enforce tier limits on /library/upload"
```

---

## Task 7: Enforce limits on ask + history endpoints

**Files:**
- Modify: `backend/src/api/v1/conversations.py`

- [ ] **Step 1: Update the conversations endpoints**

Replace the contents of `backend/src/api/v1/conversations.py`:

```python
import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from src.core.dependencies import (
    get_conversation_service,
    get_current_user,
    get_current_user_id,
    get_db,
    get_tier_service,
)
from src.core.exceptions import NotFoundError
from src.models.conversation import Conversation
from src.models.user import User
from src.schemas.conversation import AskRequest, ConversationCreate, ConversationRename
from src.services.conversation_service import IConversationService
from src.services.tier_service import TierService

router = APIRouter(prefix="/conversations", tags=["Conversations"])


@router.get("")
def get_conversations(
    user_id: int = Depends(get_current_user_id),
    service: IConversationService = Depends(get_conversation_service),
):
    return service.list_conversations(user_id)


@router.post("")
def create_conversation(
    body: ConversationCreate,
    user_id: int = Depends(get_current_user_id),
    service: IConversationService = Depends(get_conversation_service),
):
    return service.new_conversation(user_id, body.title)


@router.patch("/{conv_id}")
def rename(
    conv_id: int,
    body: ConversationRename,
    user_id: int = Depends(get_current_user_id),
    service: IConversationService = Depends(get_conversation_service),
):
    return service.rename_conversation(conv_id, user_id, body.title)


@router.delete("/{conv_id}")
def delete(
    conv_id: int,
    user_id: int = Depends(get_current_user_id),
    service: IConversationService = Depends(get_conversation_service),
):
    return service.remove_conversation(conv_id, user_id)


@router.get("/{conv_id}/messages")
def messages(
    conv_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    service: IConversationService = Depends(get_conversation_service),
    tier: TierService = Depends(get_tier_service),
):
    conv = db.get(Conversation, conv_id)
    if not conv or conv.user_id != user.id:
        raise NotFoundError("Conversation not found")
    age_days = (datetime.now(timezone.utc) - conv.created_at.replace(tzinfo=timezone.utc)).days
    tier.check_history(user.plan, age_days)
    return service.list_messages(conv_id, user.id)


@router.post("/{conv_id}/ask")
async def ask_question(
    conv_id: int,
    body: AskRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    service: IConversationService = Depends(get_conversation_service),
    tier: TierService = Depends(get_tier_service),
):
    conv = db.get(Conversation, conv_id)
    if not conv or conv.user_id != user.id:
        raise NotFoundError("Conversation not found")

    age_days = (datetime.now(timezone.utc) - conv.created_at.replace(tzinfo=timezone.utc)).days
    tier.check_history(user.plan, age_days)

    count = tier.count_queries_24h(user.id, db)
    tier.check_ask(user.plan, count)

    tier.log_query(user.id, db)

    async def streamer():
        try:
            async for event_type, data in service.ask(conv_id, user.id, body.question, body.filters, body.top_k):
                if event_type == "meta":
                    yield f"data: {json.dumps({'meta': data})}\n\n"
                elif event_type == "token":
                    yield f"data: {json.dumps({'token': data})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"event: error\ndata: {json.dumps({'message': str(e)})}\n\n"

    return StreamingResponse(streamer(), media_type="text/event-stream")
```

- [ ] **Step 2: Verify import resolution**

```bash
cd backend && python -c "from src.api.v1.conversations import router; print('OK')"
```

Expected: `OK`

- [ ] **Step 3: Run the full test suite**

```bash
cd backend && python -m pytest tests/ -v
```

Expected: All 16 tests PASS, 0 failures.

- [ ] **Step 4: Commit**

```bash
cd backend && git add src/api/v1/conversations.py
git commit -m "feat: enforce tier limits on ask and history endpoints"
```

---

## Task 8: Update SPEC.md session state

**Files:**
- Modify: `SPEC.md` (section 16)

- [ ] **Step 1: Update §16 to reflect tier limits as complete**

In `SPEC.md` section 16.1, change the backend remaining work table:

Find:
```
| `alembic upgrade head` (requires real DB connection) | ❌ Not run |
| `query.py` old router removal (§15.3) | ❌ Still in codebase |
| README.md | ❌ Not written |
| `.env.example` | ❌ Not written |
| Docker / docker-compose | ❌ Not written |
```

Replace with:
```
| `alembic upgrade head` (requires real DB connection) | ❌ Not run |
| README.md | ❌ Not written |
| `.env.example` | ✅ Done |
| Docker / docker-compose | ❌ Not written |
| Tier limit enforcement (§13) | ✅ Done |
```

- [ ] **Step 2: Commit**

```bash
git add SPEC.md
git commit -m "docs: update session state — tier limits complete, .env.example done"
```
