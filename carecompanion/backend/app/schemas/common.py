"""
Common Schemas — Standard API response wrappers.
"""

from pydantic import BaseModel
from typing import Any, Optional


class StandardResponse(BaseModel):
    """Standard success response format."""
    success: bool = True
    message: str = "Success."
    data: Optional[Any] = None


class ErrorResponse(BaseModel):
    """Standard error response format."""
    success: bool = False
    message: str = "An error occurred."
    errors: Optional[dict] = None
