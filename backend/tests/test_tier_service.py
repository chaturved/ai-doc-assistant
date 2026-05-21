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
