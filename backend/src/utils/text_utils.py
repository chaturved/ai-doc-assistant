import re
import tempfile
from typing import List

import docx
import fitz

from ..config import settings
from ..core.exceptions import BadRequestError


def clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def chunk_text(text: str, chunk_size: int = settings.TEXT_CHUNK_SIZE, overlap: int = settings.TEXT_CHUNK_OVERLAP) -> List[str]:
    text = clean_text(text)
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

def extract_text_from_bytes(contents: bytes, ext: str) -> str:
    ext = ext.lower()

    if ext == "pdf":
        text = ""
        with fitz.open(stream=contents, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
        return text

    if ext in ["docx", "doc"]:
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(contents)
            tmp.flush()
            doc_file = docx.Document(tmp.name)
            return "\n".join([p.text for p in doc_file.paragraphs])

    if ext in ["txt", "md"]:
        return contents.decode("utf-8", errors="ignore")

    raise BadRequestError(f"Unsupported file type: .{ext}")
