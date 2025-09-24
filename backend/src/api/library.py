from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from ..services.auth_service import get_current_user_id

from ..database.db import get_db
from ..services.library_service import get_library_data, save_files, clear_all

router = APIRouter(prefix="/api/library")


@router.get("")
def fetch_library(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    return get_library_data(db, current_user_id)


@router.post("/upload")
async def upload_library(
    files: list[UploadFile] = File(...),
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):

    save_files(db, current_user_id, files)
    return {"status": "ok"}


@router.post("/clear")
def clear_library(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    clear_all(db, current_user_id)
    return {"status": "ok"}
