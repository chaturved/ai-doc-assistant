from src.config import HF_API_KEY, HF_EMBEDDING_MODEL, HF_CHAT_MODEL
from huggingface_hub import AsyncInferenceClient

client = AsyncInferenceClient(api_key=HF_API_KEY)

async def get_embeddings(texts: list[str], model: str = HF_EMBEDDING_MODEL) -> list[list[float]]:
    return await client.feature_extraction(texts, model=model)

async def get_embedding(text: str, model: str = HF_EMBEDDING_MODEL) -> list[float]:
    embeddings = await client.feature_extraction(text, model=model)
    return embeddings[0]

async def stream_chat(prompt: str, model: str = HF_CHAT_MODEL, temperature: float = 0.7, max_tokens: int = 500):
    async for token in await client.text_generation(prompt, model=model, max_new_tokens=max_tokens, temperature=temperature, stream=True):
        yield token