from fastapi import APIRouter, Depends, UploadFile, File
from services.library_service import get_library_data, save_files, clear_all
from utils.auth import get_current_user

router = APIRouter(prefix="/api/library")

@router.get("/")
async def fetch_library(current_user=Depends(get_current_user)):
    return await get_library_data(current_user.id)

@router.post("/upload")
async def upload_library(files: list[UploadFile] = File(...)):
    file_list = [{"name": f.filename, "size": f"{f.spool_max_size / 1024:.0f} KB", "type": f.filename.filename.split('.')[-1]} for f in files]
    await save_files(file_list)
    return {"status": "ok"}

@router.post("/clear")
async def clear_library():
    await clear_all()
    return {"status": "ok"}
