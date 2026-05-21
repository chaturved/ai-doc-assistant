import pytest
from src.core.exceptions import PlanLimitError


def test_plan_limit_error_has_correct_status():
    err = PlanLimitError("documents")
    assert err.status_code == 402
    assert err.limit == "documents"
    assert err.code == "LIMIT_EXCEEDED"
