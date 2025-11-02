from src.config import HF_API_KEY, HF_EMBEDDING_MODEL, HF_CHAT_MODEL
from huggingface_hub import AsyncInferenceClient

client = AsyncInferenceClient(api_key=HF_API_KEY)

async def get_embeddings(texts: list[str], model: str = HF_EMBEDDING_MODEL) -> list[list[float]]:
    return await client.feature_extraction(texts, model=model)

async def get_embedding(text: str, model: str = HF_EMBEDDING_MODEL) -> list[float]:
    return await client.feature_extraction(text, model=model)

async def stream_chat(
    prompt: str,
    model: str = HF_CHAT_MODEL,
    temperature: float = 0.7,
    max_tokens: int = 500
):
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": prompt}
    ]

    stream = await client.chat_completion(
        messages,
        model=model,
        max_tokens=max_tokens,
        temperature=temperature,
        stream=True
    )

    async for event in stream:
        for choice in event.choices:
            if hasattr(choice.delta, "content") and choice.delta.content:
                yield choice.delta.content