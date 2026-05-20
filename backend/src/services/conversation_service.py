from typing import AsyncGenerator, Protocol

from fastapi import Depends

from src.core.exceptions import NotFoundError
from src.repositories.conversation_repository import ConversationRepository, IConversationRepository
from src.repositories.library_repository import ILibraryRepository, LibraryRepository
from src.schemas.conversation import ConversationOut, MessageOut
from src.schemas.user import MessageResponse
from src.utils.hugging_face import get_embedding
from src.utils.query_utils import (
    build_context_text,
    generate_description_and_badges,
    generate_snippets,
    generate_sources,
    get_library_chunks,
    stream_answer,
)


class IConversationService(Protocol):
    def list_conversations(self, user_id: int) -> list[ConversationOut]: ...
    def new_conversation(self, user_id: int, title: str) -> ConversationOut: ...
    def rename_conversation(self, conv_id: int, user_id: int, title: str) -> ConversationOut: ...
    def remove_conversation(self, conv_id: int, user_id: int) -> MessageResponse: ...
    def list_messages(self, conv_id: int, user_id: int) -> list[MessageOut]: ...
    def ask(
        self,
        conv_id: int,
        user_id: int,
        question: str,
        filters: dict | None,
        top_k: int,
    ) -> AsyncGenerator[tuple[str, dict | str], None]: ...


class ConversationService(IConversationService):
    def __init__(
        self,
        conv_repo: IConversationRepository = Depends(ConversationRepository),
        lib_repo: ILibraryRepository = Depends(LibraryRepository),
    ):
        self.conv_repo = conv_repo
        self.lib_repo = lib_repo

    def list_conversations(self, user_id: int) -> list[ConversationOut]:
        return [ConversationOut.model_validate(c) for c in self.conv_repo.get_all(user_id)]

    def new_conversation(self, user_id: int, title: str = "New conversation") -> ConversationOut:
        conv = self.conv_repo.create(user_id, title)
        return ConversationOut.model_validate(conv)

    def rename_conversation(self, conv_id: int, user_id: int, title: str) -> ConversationOut:
        conv = self.conv_repo.get_by_id(conv_id, user_id)
        if not conv:
            raise NotFoundError("Conversation not found")
        conv = self.conv_repo.update_title(conv, title)
        return ConversationOut.model_validate(conv)

    def remove_conversation(self, conv_id: int, user_id: int) -> MessageResponse:
        conv = self.conv_repo.get_by_id(conv_id, user_id)
        if not conv:
            raise NotFoundError("Conversation not found")
        self.conv_repo.delete(conv)
        return MessageResponse(message="Conversation deleted")

    def list_messages(self, conv_id: int, user_id: int) -> list[MessageOut]:
        conv = self.conv_repo.get_by_id(conv_id, user_id)
        if not conv:
            raise NotFoundError("Conversation not found")
        return [MessageOut.model_validate(m) for m in self.conv_repo.get_messages(conv_id)]

    async def ask(
        self,
        conv_id: int,
        user_id: int,
        question: str,
        filters: dict | None,
        top_k: int,
    ) -> AsyncGenerator[tuple[str, dict | str], None]:
        conv = self.conv_repo.get_by_id(conv_id, user_id)
        if not conv:
            raise NotFoundError("Conversation not found")

        self.conv_repo.add_message(conv_id, "user", question)

        raw_vector = await get_embedding(question)
        query_vector = raw_vector.tolist() if hasattr(raw_vector, "tolist") else list(raw_vector)
        doc_id = filters.get("doc_id") if filters else None
        results = self.lib_repo.get_top_k_chunks(user_id, query_vector, top_k, doc_id)
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

        full_answer = ""
        async for token in stream_answer(context_text, question):
            full_answer += token
            yield "token", token

        self.conv_repo.add_message(conv_id, "assistant", full_answer, meta)

        if conv.title == "New conversation":
            short_q = question[:60] + ("…" if len(question) > 60 else "")
            self.conv_repo.update_title(conv, short_q)
        else:
            self.conv_repo.touch(conv)
