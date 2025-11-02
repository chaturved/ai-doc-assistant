from typing import Dict, Optional
from pydantic import BaseModel

class QuerySearchRequest(BaseModel):
    question: str
    top_k: Optional[int] = 5
    filters: Optional[Dict[str, str]] = None