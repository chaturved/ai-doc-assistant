import httpx
import json
from src.config import HF_API_BASE, HF_API_KEY, HF_EMBEDDING_MODEL, HF_CHAT_MODEL
from huggingface_hub import AsyncInferenceClient

client = AsyncInferenceClient(api_key=HF_API_KEY)

async def get_embeddings(texts: list[str], model: str = HF_EMBEDDING_MODEL) -> list[float]:
    return await client.feature_extraction(texts, model=model)

async def get_chat_completion(messages: list, model: str = HF_CHAT_MODEL, temperature: float = 0.7, max_tokens: int = 500):
    prompt = "\n".join([f"{m['role']}: {m['content']}" for m in messages]) + "\nassistant:"

    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "inputs": prompt,
        "parameters": {
            "temperature": temperature,
            "max_new_tokens": max_tokens,
            "return_full_text": False,
        }
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{HF_API_BASE}/{model}", headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data[0]["generated_text"]


async def stream_chat(payload: dict, model: str = HF_CHAT_MODEL):
    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=None) as client:
        async with client.stream("POST", f"{HF_API_BASE}/{model}/stream", headers=headers, json=payload) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if line:
                    try:
                        data = json.loads(line)
                        if "token" in data and "text" in data["token"]:
                            yield data["token"]["text"]
                    except json.JSONDecodeError:
                        continue
