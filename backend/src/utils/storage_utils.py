import os
import uuid
import boto3
import botocore.exceptions
from botocore.client import Config
from fastapi import UploadFile
from ..config import settings
from ..core.exceptions import AppError


class StorageError(AppError):
    def __init__(self, message: str):
        super().__init__(message, "STORAGE_ERROR", 502)


s3_client = boto3.client(
    "s3",
    endpoint_url=settings.S3_ENDPOINT,
    region_name=settings.S3_REGION,
    aws_access_key_id=settings.S3_ACCESS_KEY,
    aws_secret_access_key=settings.S3_SECRET_ACCESS_KEY,
    config=Config(signature_version="v4"),
)


async def save_raw_file(file: UploadFile, user_id: int) -> tuple[str, bytes]:
    contents = await file.read()
    safe_name = os.path.basename(file.filename or "") or "upload"
    key = f"{user_id}/{uuid.uuid4()}/{safe_name}"

    try:
        s3_client.put_object(Bucket=settings.S3_LIBRARY_BUCKET, Key=key, Body=contents)
    except botocore.exceptions.ClientError as e:
        raise StorageError(f"Storage error: {e.response['Error']['Message']}")

    public_url = f"{settings.S3_ENDPOINT}/object/{settings.S3_LIBRARY_BUCKET}/{key}"
    file.file.seek(0)
    return public_url, contents


def delete_file(file_path: str) -> None:
    key = file_path.split(f"/{settings.S3_LIBRARY_BUCKET}/")[-1]
    try:
        s3_client.delete_object(Bucket=settings.S3_LIBRARY_BUCKET, Key=key)
    except botocore.exceptions.ClientError as e:
        raise StorageError(f"Storage error: {e.response['Error']['Message']}")
