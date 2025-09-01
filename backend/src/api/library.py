from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from backend.src.database.db import get_db
from backend.src.services.token_service import get_current_user_id
from backend.src.services.library_service import get_library_data, save_files, clear_all

router = APIRouter(prefix="/api/library")


@router.get("/")
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
    file_list = []
    for f in files:
        # read contents to calculate size
        contents = await f.read()
        size_kb = f"{len(contents) / 1024:.0f} KB"
        file_list.append(
            {
                "name": f.filename,
                "size": size_kb,
                "type": f.filename.split(".")[-1],
            }
        )
        f.file.seek(0)  # reset cursor if you need file again

    save_files(db, current_user_id, file_list)
    return {"status": "ok"}


@router.post("/clear")
def clear_library(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    clear_all(db, current_user_id)
    return {"status": "ok"}
