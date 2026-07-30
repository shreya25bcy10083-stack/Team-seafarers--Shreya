"""
CareCompanion File Upload Helpers.

MIME type validation and Cloudinary upload utility.
Following File Upload Rules: PDF, PNG, JPG, JPEG only. Max 10 MB.
"""

import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from app.config import get_settings
from app.core.exceptions import FileUploadException

settings = get_settings()

# Configure Cloudinary from URL
cloudinary.config(
    cloudinary_url=settings.CLOUDINARY_URL,
    secure=True,
)

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
}

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg"}


def validate_file(file: UploadFile) -> None:
    """
    Validate uploaded file type and size.

    Args:
        file: The uploaded file to validate.

    Raises:
        FileUploadException: If file type or size is invalid.
    """
    # Check MIME type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise FileUploadException(
            message=f"File type '{file.content_type}' is not allowed. "
            f"Allowed types: PDF, PNG, JPG, JPEG."
        )

    # Check file extension
    if file.filename:
        extension = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
        if extension not in ALLOWED_EXTENSIONS:
            raise FileUploadException(
                message=f"File extension '.{extension}' is not allowed."
            )


import os
import uuid

async def upload_to_cloudinary(file: UploadFile, folder: str = "reports") -> dict:
    """
    Upload a file to Cloudinary, with local filesystem fallback.

    Args:
        file: The uploaded file.
        folder: Cloudinary folder name.

    Returns:
        Dict with 'url' and 'public_id'.
    """
    validate_file(file)

    try:
        contents = await file.read()

        # Check file size
        if len(contents) > settings.MAX_UPLOAD_SIZE:
            raise FileUploadException(
                message=f"File size exceeds maximum of {settings.MAX_UPLOAD_SIZE // (1024 * 1024)} MB."
            )

        # Attempt Cloudinary upload if configured
        if settings.CLOUDINARY_URL and "YOUR_CLOUD_NAME" not in settings.CLOUDINARY_URL:
            try:
                result = cloudinary.uploader.upload(
                    contents,
                    folder=folder,
                    resource_type="auto",
                )
                return {
                    "url": result.get("secure_url", ""),
                    "public_id": result.get("public_id", ""),
                }
            except Exception:
                pass  # Fallback to local storage

        # Local storage fallback
        upload_dir = os.path.join(os.getcwd(), "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        safe_filename = f"{uuid.uuid4().hex[:8]}_{file.filename or 'report.pdf'}"
        file_path = os.path.join(upload_dir, safe_filename)
        with open(file_path, "wb") as f:
            f.write(contents)

        local_url = f"/uploads/{safe_filename}"
        return {
            "url": local_url,
            "public_id": safe_filename,
        }
    except FileUploadException:
        raise
    except Exception as e:
        raise FileUploadException(
            message=f"Failed to upload file: {str(e)}"
        )
    finally:
        await file.seek(0)
