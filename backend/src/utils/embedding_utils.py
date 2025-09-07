from ..config import OPENAI_API_KEY, EMBEDDING_MODEL
import httpx

async def get_embedding(text: str) -> list[float]:
    url = "https://api.openai.com/v1/embeddings"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }
    json_data = {
        "model": EMBEDDING_MODEL,
        "input": text
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=json_data)
        response.raise_for_status()
        data = response.json()
    
    return data["data"][0]["embedding"]
