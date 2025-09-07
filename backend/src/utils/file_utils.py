import os
from ..config import FILE_UPLOAD_DIR
import fitz
import docx
from fastapi import UploadFile

def ensure_upload_dir():
    os.makedirs(FILE_UPLOAD_DIR, exist_ok=True)


async def save_raw_file(file: UploadFile, user_id: int) -> str:
    ensure_upload_dir()
    file_path = os.path.join(FILE_UPLOAD_DIR, f"{user_id}_{file.filename}")

    contents = await file.read()
    with open(file_path, "wb") as out_file:
        out_file.write(contents)

    # Reset pointer so file can be reused if needed
    file.file.seek(0)

    return file_path, contents


def extract_text(file_path: str, ext: str) -> str:
    ext = ext.lower()

    if ext == "pdf":
        text = ""
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text()
        return text

    if ext in ["docx", "doc"]:
        doc_file = docx.Document(file_path)
        return "\n".join([p.text for p in doc_file.paragraphs])

    if ext in ["txt", "md"]:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    return ""
