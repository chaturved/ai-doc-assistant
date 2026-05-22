from unittest.mock import MagicMock

import pytest

from src.repositories.waitlist_repository import WaitlistRepositoryProtocol
from src.services.waitlist_service import WaitlistService


class TestWaitlistService:
    @pytest.fixture(autouse=True)
    def setup(self) -> None:
        self.mock_repo = MagicMock(spec_set=WaitlistRepositoryProtocol)
        self.svc = WaitlistService(repo=self.mock_repo)

    def test_join_returns_already_on_list_when_email_exists(self):
        self.mock_repo.exists.return_value = True

        result = self.svc.join("existing@example.com")

        self.mock_repo.add.assert_not_called()
        assert "already" in result.message.lower()

    def test_join_adds_and_returns_confirmation_for_new_email(self):
        self.mock_repo.exists.return_value = False

        result = self.svc.join("new@example.com")

        self.mock_repo.add.assert_called_once_with("new@example.com")
        assert "list" in result.message.lower()
