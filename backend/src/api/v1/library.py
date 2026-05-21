from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.core.dependencies import get_current_user, get_current_user_id, get_db, get_library_service, get_tier_service
from src.models.library import Library
from src.models.user import User
from src.services.library_service import ILibraryService
from src.services.tier_service import TierService

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
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    service: ILibraryService = Depends(get_library_service),
    tier: TierService = Depends(get_tier_service),
):
    current_count = db.scalar(select(func.count()).select_from(Library).where(Library.user_id == user.id)) or 0
    tier.check_upload(user.plan, files, current_count)
    return await service.save_files(user.id, files)


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
