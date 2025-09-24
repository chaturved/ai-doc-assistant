import boto3
from botocore.client import Config
from fastapi import UploadFile
from ..config import S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY, S3_LIBRARY_BUCKET

s3_client = boto3.client(
    "s3",
    endpoint_url=S3_ENDPOINT,
    region_name=S3_REGION,
    aws_access_key_id=S3_ACCESS_KEY,
    aws_secret_access_key=S3_SECRET_ACCESS_KEY,
    config=Config(signature_version="v4"),
)


async def save_raw_file(file: UploadFile, user_id: int) -> tuple[str, bytes]:
    contents = await file.read()
    key = f"{user_id}/{file.filename}"

    s3_client.put_object(
        Bucket=S3_LIBRARY_BUCKET,
        Key=key,
        Body=contents,
    )

    public_url = f"{S3_ENDPOINT}/object/{S3_LIBRARY_BUCKET}/{key}"
    file.file.seek(0)
    return public_url, contents


async def delete_file(file_path: str) -> None:
    key = file_path.split(f"/{S3_LIBRARY_BUCKET}/")[-1]
    s3_client.delete_object(Bucket=S3_LIBRARY_BUCKET, Key=key)
