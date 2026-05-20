from datetime import datetime
from pydantic import BaseModel


class LibraryDocResponse(BaseModel):
    id: int
    name: str
    type: str
    size: int
    created_at: datetime

    model_config = {"from_attributes": True}


class LibraryResponse(BaseModel):
    count: int
    total_size_bytes: int
    sections: list[LibraryDocResponse]


class UploadItemResponse(BaseModel):
    id: int
    name: str
    type: str
    size: int

    model_config = {"from_attributes": True}


class UploadErrorResponse(BaseModel):
    file: str
    error: str


class UploadResponse(BaseModel):
    uploaded: list[UploadItemResponse]
    errors: list[UploadErrorResponse]
