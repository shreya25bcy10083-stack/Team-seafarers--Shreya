"""
CareCompanion Custom Exceptions.

Centralized exception classes and FastAPI exception handlers.
Following Error Handling Rules: catch all errors, return meaningful messages,
never expose stack traces.
"""

from fastapi import Request, status
from fastapi.responses import JSONResponse


class CareCompanionException(Exception):
    """Base exception for CareCompanion."""

    def __init__(self, message: str = "An error occurred.", status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class NotFoundException(CareCompanionException):
    """Resource not found."""

    def __init__(self, message: str = "Resource not found."):
        super().__init__(message=message, status_code=404)


class UnauthorizedException(CareCompanionException):
    """Authentication failed."""

    def __init__(self, message: str = "Authentication required."):
        super().__init__(message=message, status_code=401)


class ForbiddenException(CareCompanionException):
    """Insufficient permissions."""

    def __init__(self, message: str = "You do not have permission to perform this action."):
        super().__init__(message=message, status_code=403)


class BadRequestException(CareCompanionException):
    """Invalid request data."""

    def __init__(self, message: str = "Invalid request.", errors: dict | None = None):
        self.errors = errors or {}
        super().__init__(message=message, status_code=400)


class ConflictException(CareCompanionException):
    """Resource already exists."""

    def __init__(self, message: str = "Resource already exists."):
        super().__init__(message=message, status_code=409)


class AIServiceException(CareCompanionException):
    """AI service failure."""

    def __init__(self, message: str = "AI service is temporarily unavailable."):
        super().__init__(message=message, status_code=503)


class FileUploadException(CareCompanionException):
    """File upload validation failed."""

    def __init__(self, message: str = "File upload failed."):
        super().__init__(message=message, status_code=422)


async def carecompanion_exception_handler(
    request: Request, exc: CareCompanionException
) -> JSONResponse:
    """Global handler for CareCompanion exceptions."""
    response_body = {
        "success": False,
        "message": exc.message,
        "errors": getattr(exc, "errors", {}),
    }
    return JSONResponse(status_code=exc.status_code, content=response_body)


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all handler — never expose stack traces."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An unexpected error occurred. Please try again later.",
            "errors": {},
        },
    )
