"""
CareCompanion Utility — Standard Response Builders.

Every API response follows the documented format:
  Success: { success: true, message: "", data: {} }
  Error:   { success: false, message: "", errors: {} }
"""

from typing import Any, Optional


def success_response(
    data: Any = None,
    message: str = "Success.",
) -> dict:
    """Build a standard success response."""
    return {
        "success": True,
        "message": message,
        "data": data,
    }


def error_response(
    message: str = "An error occurred.",
    errors: Optional[dict] = None,
) -> dict:
    """Build a standard error response."""
    return {
        "success": False,
        "message": message,
        "errors": errors or {},
    }
