"""
CareCompanion Response Builder.

Standardized API response helpers following API Rules.
Every endpoint returns: { success, message, data } or { success, message, errors }.
"""


def success_response(data: dict | list | None = None, message: str = "") -> dict:
    """
    Build a standardized success response.

    Args:
        data: Response payload.
        message: Human-readable success message.

    Returns:
        Standardized success dict.
    """
    return {
        "success": True,
        "message": message,
        "data": data if data is not None else {},
    }


def error_response(message: str = "An error occurred.", errors: dict | None = None) -> dict:
    """
    Build a standardized error response.

    Args:
        message: Human-readable error message.
        errors: Detailed error information.

    Returns:
        Standardized error dict.
    """
    return {
        "success": False,
        "message": message,
        "errors": errors if errors is not None else {},
    }
