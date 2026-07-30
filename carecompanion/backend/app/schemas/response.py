"""
Standardized API response schemas.

Every endpoint returns this format per API_SCHEMA.md.
"""

from pydantic import BaseModel
from typing import Any


class APIResponse(BaseModel):
    """Standard success response."""
    success: bool = True
    message: str = ""
    data: Any = {}


class APIErrorResponse(BaseModel):
    """Standard error response."""
    success: bool = False
    message: str = ""
    errors: dict = {}
