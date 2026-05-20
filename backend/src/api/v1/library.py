from fastapi import APIRouter, Depends, File, UploadFile

from src.core.dependencies import get_current_user_id, get_library_service
from src.services.library_service import ILibraryService

router = APIRouter(prefix="/library", tags=["Library"])


@router.get("")
def fetch_library(
    user_id: int = Depends(get_current_user_id),
    service: ILibraryService = Depends(get_library_service),
):
    return service.get_library_data(user_id)


@router.post("/upload")
async def upload_library(
    files: list[UploadFile] = File(...),
    user_id: int = Depends(get_current_user_id),
    service: ILibraryService = Depends(get_library_service),
):
    return await service.save_files(user_id, files)


@router.delete("/clear")
def clear_library(
    user_id: int = Depends(get_current_user_id),
    service: ILibraryService = Depends(get_library_service),
):
    return service.clear_all(user_id)


@router.delete("/{doc_id}")
def delete_doc(
    doc_id: int,
    user_id: int = Depends(get_current_user_id),
    service: ILibraryService = Depends(get_library_service),
):
    return service.delete_document(doc_id, user_id)
