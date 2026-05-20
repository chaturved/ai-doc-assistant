import ssl
import certifi

# Fix SSL certificate verification on macOS with Python 3.11
_orig_create_default_context = ssl.create_default_context
ssl.create_default_context = lambda *args, **kwargs: _orig_create_default_context(
    *args, cafile=certifi.where(), **{k: v for k, v in kwargs.items() if k != "cafile"}
)

from src.config import settings
from huggingface_hub import AsyncInferenceClient
from typing import Any, AsyncGenerator, List

client = AsyncInferenceClient(api_key=settings.HF_API_KEY)

async def get_embeddings(texts: List[str], model: str = settings.HF_EMBEDDING_MODEL) -> Any:
    return await client.feature_extraction(texts, model=model)  # type: ignore

async def get_embedding(text: str, model: str = settings.HF_EMBEDDING_MODEL) -> Any:
    return await client.feature_extraction(text, model=model)

async def stream_chat(
    prompt: str,
    model: str = settings.HF_CHAT_MODEL,
    temperature: float = 0.7,
    max_tokens: int = 500
) -> AsyncGenerator[str, None]:
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": prompt},
    ]

    stream_gen = await client.chat_completion(
        messages,
        model=model,
        max_tokens=max_tokens,
        temperature=temperature,
        stream=True
    )

    async for event in stream_gen:
        for choice in event.choices:
            if hasattr(choice.delta, "content") and choice.delta.content:
                yield choice.delta.content


async def chat(
    prompt: str,
    model: str = settings.HF_CHAT_MODEL,
    temperature: float = 0.7,
    max_tokens: int = 200
) -> str:
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": prompt},
    ]

    response = await client.chat_completion(
        messages,
        model=model,
        max_tokens=max_tokens,
        temperature=temperature,
        stream=False
    )

    return response.choices[0].message.content or ""
