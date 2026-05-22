import io
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from src.core.enums import Plan
from src.core.exceptions import NotFoundError
from src.repositories.library_repository import LibraryRepositoryProtocol
from src.services.library_service import LibraryService
from src.services.tier_service import TierServiceProtocol


def _make_lib(id=1, name="doc.pdf", type="pdf", size=1024, path: str | None = "/tmp/doc.pdf"):
    lib = MagicMock()
    lib.id = id
    lib.name = name
    lib.type = type
    lib.size = size
    lib.path = path
    lib.created_at = datetime(2024, 1, 1, tzinfo=timezone.utc)
    return lib


class TestLibraryService:
    @pytest.fixture(autouse=True)
    def setup(self) -> None:
        self.mock_repo = MagicMock(spec_set=LibraryRepositoryProtocol)
        self.mock_tier = MagicMock(spec_set=TierServiceProtocol)
        self.svc = LibraryService(repo=self.mock_repo, tier=self.mock_tier)

    # ── get_library_data ──────────────────────────────────────────────────────

    def test_get_library_data_aggregates_size_and_count(self):
        lib1 = _make_lib(id=1, size=100)
        lib2 = _make_lib(id=2, size=200)
        self.mock_repo.get_all.return_value = [lib1, lib2]

        result = self.svc.get_library_data(user_id=1)

        assert result.count == 2
        assert result.total_size_bytes == 300
        assert len(result.sections) == 2

    def test_get_library_data_empty_library(self):
        self.mock_repo.get_all.return_value = []

        result = self.svc.get_library_data(user_id=1)

        assert result.count == 0
        assert result.total_size_bytes == 0
        assert result.sections == []

    # ── save_files ────────────────────────────────────────────────────────────

    async def test_save_files_calls_tier_check_with_current_count(self):
        self.mock_repo.get_all.return_value = [_make_lib()] * 3

        saved = _make_lib(id=10, name="new.pdf", type="pdf", size=512)
        self.mock_repo.add.return_value = saved

        file = MagicMock()
        file.filename = "new.pdf"
        file.file = io.BytesIO(b"content")

        with (
            patch("src.services.library_service.save_raw_file", AsyncMock(return_value=("/url/new.pdf", b"content"))),
            patch("src.services.library_service.extract_text_from_bytes", return_value="extracted text"),
            patch("src.services.library_service.chunk_text", return_value=["chunk"]),
            patch("src.services.library_service.get_embeddings", AsyncMock(return_value=[MagicMock(tolist=MagicMock(return_value=[0.1]))])),
        ):
            await self.svc.save_files(user_id=1, plan=Plan.FREE, files=[file])

        self.mock_tier.check_upload.assert_called_once_with(Plan.FREE, [file], 3)

    async def test_save_files_success_records_upload(self):
        self.mock_repo.get_all.return_value = []

        saved = _make_lib(id=5, name="report.pdf", type="pdf", size=2048)
        self.mock_repo.add.return_value = saved

        file = MagicMock()
        file.filename = "report.pdf"
        file.file = io.BytesIO(b"pdf bytes")

        mock_emb = MagicMock()
        mock_emb.tolist.return_value = [0.1, 0.2]

        with (
            patch("src.services.library_service.save_raw_file", AsyncMock(return_value=("/url/report.pdf", b"pdf bytes"))),
            patch("src.services.library_service.extract_text_from_bytes", return_value="text"),
            patch("src.services.library_service.chunk_text", return_value=["chunk 1"]),
            patch("src.services.library_service.get_embeddings", AsyncMock(return_value=[mock_emb])),
        ):
            result = await self.svc.save_files(user_id=1, plan=Plan.FREE, files=[file])

        assert len(result.uploaded) == 1
        assert result.errors == []
        self.mock_repo.add.assert_called_once()
        self.mock_repo.add_chunks.assert_called_once()

    async def test_save_files_captures_per_file_error(self):
        self.mock_repo.get_all.return_value = []

        file = MagicMock()
        file.filename = "bad.pdf"
        file.file = io.BytesIO(b"")

        with patch("src.services.library_service.save_raw_file", AsyncMock(side_effect=RuntimeError("storage down"))):
            result = await self.svc.save_files(user_id=1, plan=Plan.FREE, files=[file])

        assert result.uploaded == []
        assert len(result.errors) == 1
        assert result.errors[0].file == "bad.pdf"
        assert "storage down" in result.errors[0].error

    async def test_save_files_partial_errors_dont_abort_remaining(self):
        self.mock_repo.get_all.return_value = []

        bad_file = MagicMock()
        bad_file.filename = "bad.pdf"
        bad_file.file = io.BytesIO(b"")

        good_file = MagicMock()
        good_file.filename = "good.pdf"
        good_file.file = io.BytesIO(b"content")

        saved = _make_lib(id=1, name="good.pdf")
        self.mock_repo.add.return_value = saved
        mock_emb = MagicMock()
        mock_emb.tolist.return_value = [0.1]

        async def fake_save(f, user_id):
            if f.filename == "bad.pdf":
                raise RuntimeError("bad file")
            return ("/url/good.pdf", b"content")

        with (
            patch("src.services.library_service.save_raw_file", fake_save),
            patch("src.services.library_service.extract_text_from_bytes", return_value="text"),
            patch("src.services.library_service.chunk_text", return_value=["chunk"]),
            patch("src.services.library_service.get_embeddings", AsyncMock(return_value=[mock_emb])),
        ):
            result = await self.svc.save_files(user_id=1, plan=Plan.FREE, files=[bad_file, good_file])

        assert len(result.uploaded) == 1
        assert len(result.errors) == 1

    # ── delete_document ───────────────────────────────────────────────────────

    def test_delete_document_raises_when_not_found(self):
        self.mock_repo.get_by_id.return_value = None

        with pytest.raises(NotFoundError):
            self.svc.delete_document(doc_id=99, user_id=1)

    def test_delete_document_deletes_file_and_record(self):
        lib = _make_lib(path="/tmp/doc.pdf")
        self.mock_repo.get_by_id.return_value = lib

        with patch("src.services.library_service.delete_file") as mock_delete:
            result = self.svc.delete_document(doc_id=1, user_id=1)

        mock_delete.assert_called_once_with("/tmp/doc.pdf")
        self.mock_repo.delete.assert_called_once_with(lib)
        assert result.message == "Document deleted"

    def test_delete_document_skips_delete_file_when_no_path(self):
        lib = _make_lib(path=None)
        self.mock_repo.get_by_id.return_value = lib

        with patch("src.services.library_service.delete_file") as mock_delete:
            self.svc.delete_document(doc_id=1, user_id=1)

        mock_delete.assert_not_called()
        self.mock_repo.delete.assert_called_once_with(lib)

    # ── clear_all ─────────────────────────────────────────────────────────────

    def test_clear_all_deletes_all_files_and_clears_repo(self):
        libs = [_make_lib(id=1, path="/tmp/a.pdf"), _make_lib(id=2, path="/tmp/b.pdf")]
        self.mock_repo.get_all.return_value = libs

        with patch("src.services.library_service.delete_file") as mock_delete:
            result = self.svc.clear_all(user_id=1)

        assert mock_delete.call_count == 2
        self.mock_repo.clear_user_library.assert_called_once_with(1)
        assert result.message == "Library cleared"

    def test_clear_all_continues_when_delete_file_fails(self):
        libs = [_make_lib(id=1, path="/tmp/a.pdf"), _make_lib(id=2, path="/tmp/b.pdf")]
        self.mock_repo.get_all.return_value = libs

        with patch("src.services.library_service.delete_file", side_effect=OSError("disk error")):
            result = self.svc.clear_all(user_id=1)

        self.mock_repo.clear_user_library.assert_called_once_with(1)
        assert result.message == "Library cleared"

    def test_clear_all_skips_delete_when_no_path(self):
        libs = [_make_lib(id=1, path=None), _make_lib(id=2, path="/tmp/b.pdf")]
        self.mock_repo.get_all.return_value = libs

        with patch("src.services.library_service.delete_file") as mock_delete:
            self.svc.clear_all(user_id=1)

        assert mock_delete.call_count == 1
