from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from src.services.auth_service import get_current_user_id
from src.database.db import get_db
from src.services.library_service import clear_all, delete_document, get_library_data, save_files

router = APIRouter(prefix="/library", tags=["Library"])


@router.get("")
def fetch_library(db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user_id)):
    return get_library_data(db, current_user_id)


@router.post("/upload")
async def upload_library(
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    return await save_files(db, current_user_id, files)


@router.delete("/clear")
def clear_library(db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user_id)):
    return clear_all(db, current_user_id)


@router.delete("/{doc_id}")
def delete_doc(doc_id: int, db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user_id)):
    return delete_document(db, doc_id, current_user_id)
