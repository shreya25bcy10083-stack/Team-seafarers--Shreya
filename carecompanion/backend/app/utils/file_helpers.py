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


async def upload_to_cloudinary(file: UploadFile, folder: str = "reports") -> dict:
    """
    Upload a file to Cloudinary.

    Args:
        file: The uploaded file.
        folder: Cloudinary folder name.

    Returns:
        Dict with 'url' and 'public_id'.

    Raises:
        FileUploadException: If upload fails.
    """
    validate_file(file)

    try:
        contents = await file.read()

        # Check file size
        if len(contents) > settings.MAX_UPLOAD_SIZE:
            raise FileUploadException(
                message=f"File size exceeds maximum of {settings.MAX_UPLOAD_SIZE // (1024 * 1024)} MB."
            )

        result = cloudinary.uploader.upload(
            contents,
            folder=folder,
            resource_type="auto",
        )

        return {
            "url": result.get("secure_url", ""),
            "public_id": result.get("public_id", ""),
        }
    except FileUploadException:
        raise
    except Exception as e:
        raise FileUploadException(
            message="Failed to upload file. Please try again."
        )
    finally:
        await file.seek(0)
