from abc import abstractmethod
from typing import Protocol

from fastapi import Depends, UploadFile

from src.core.exceptions import NotFoundError
from src.models import Library, LibraryChunk
from src.repositories.library_repository import ILibraryRepository, LibraryRepository
from src.schemas.library import LibraryDocResponse, LibraryResponse, UploadErrorResponse, UploadItemResponse, UploadResponse
from src.schemas.user import MessageResponse
from src.utils.hugging_face import get_embeddings
from src.utils.storage_utils import delete_file, save_raw_file
from src.utils.text_utils import chunk_text, extract_text_from_bytes


class ILibraryService(Protocol):
    @abstractmethod
    def get_library_data(self, user_id: int) -> LibraryResponse: ...
    @abstractmethod
    async def save_files(self, user_id: int, files: list[UploadFile]) -> UploadResponse: ...
    @abstractmethod
    def delete_document(self, doc_id: int, user_id: int) -> MessageResponse: ...
    @abstractmethod
    def clear_all(self, user_id: int) -> MessageResponse: ...


class LibraryService(ILibraryService):
    def __init__(self, repo: ILibraryRepository = Depends(LibraryRepository)):
        self.repo = repo

    def get_library_data(self, user_id: int) -> LibraryResponse:
        rows = self.repo.get_all(user_id)
        return LibraryResponse(
            count=len(rows),
            total_size_bytes=sum(r.size for r in rows),
            sections=[LibraryDocResponse.model_validate(r) for r in rows],
        )

    async def save_files(self, user_id: int, files: list[UploadFile]) -> UploadResponse:
        uploaded: list[UploadItemResponse] = []
        errors: list[UploadErrorResponse] = []

        for f in files:
            try:
                file_url, contents = await save_raw_file(f, user_id)
                size_bytes = len(contents)
                ext = (f.filename or "").split(".")[-1].lower()
                extracted_text = extract_text_from_bytes(contents, ext)

                library = Library(
                    user_id=user_id,
                    name=f.filename,
                    type=ext,
                    size=size_bytes,
                    path=file_url,
                    extracted_text=extracted_text,
                )
                library = self.repo.add(library)

                chunks = chunk_text(extracted_text)
                embeddings = await get_embeddings(chunks)

                chunk_records = [
                    LibraryChunk(
                        library_id=library.id,
                        chunk_index=i,
                        chunk_text=chunk_txt,
                        embedding=emb.tolist() if hasattr(emb, "tolist") else list(emb),
                    )
                    for i, (chunk_txt, emb) in enumerate(zip(chunks, embeddings))
                ]
                self.repo.add_chunks(chunk_records)
                f.file.seek(0)
                uploaded.append(UploadItemResponse.model_validate(library))
            except Exception as e:
                errors.append(UploadErrorResponse(file=f.filename or "", error=str(e)))

        return UploadResponse(uploaded=uploaded, errors=errors)

    def delete_document(self, doc_id: int, user_id: int) -> MessageResponse:
        lib = self.repo.get_by_id(doc_id, user_id)
        if not lib:
            raise NotFoundError("Document not found")
        delete_file(lib.path)
        self.repo.delete(lib)
        return MessageResponse(message="Document deleted")

    def clear_all(self, user_id: int) -> MessageResponse:
        for lib in self.repo.get_all(user_id):
            try:
                delete_file(lib.path)
            except Exception:
                pass
        self.repo.clear_user_library(user_id)
        return MessageResponse(message="Library cleared")
