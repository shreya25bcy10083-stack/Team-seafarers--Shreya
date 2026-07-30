"""
CareCompanion Shared Dependencies.

FastAPI Depends() for database sessions, authentication, and authorization.
Following Dependency Rules: never manually create dependencies inside routes.
"""

from fastapi import Depends, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import verify_access_token
from app.core.exceptions import UnauthorizedException, ForbiddenException
from app.repositories.user_repository import UserRepository


def get_current_user(authorization: str = Header(..., description="Bearer JWT token"), db: Session = Depends(get_db)) -> dict:
    """
    Extract and validate the current user from JWT token.

    Returns:
        Dict with user_id and role.

    Raises:
        UnauthorizedException: If token is invalid or missing.
    """
    if not authorization.startswith("Bearer "):
        raise UnauthorizedException(message="Invalid authorization header format.")

    token = authorization.replace("Bearer ", "")
    payload = verify_access_token(token)

    if not payload:
        raise UnauthorizedException(message="Invalid or expired token.")

    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id:
        raise UnauthorizedException(message="Invalid token payload.")

    # Verify user still exists
    user_repo = UserRepository(db)
    user = user_repo.get_by_id(int(user_id))
    if not user:
        raise UnauthorizedException(message="User not found.")

    return {"user_id": int(user_id), "role": role}


def require_patient(current_user: dict = Depends(get_current_user)) -> dict:
    """Require the current user to have the 'patient' role."""
    if current_user["role"] != "patient":
        raise ForbiddenException(message="This action requires a patient account.")
    return current_user


def require_caregiver(current_user: dict = Depends(get_current_user)) -> dict:
    """Require the current user to have the 'caregiver' role."""
    if current_user["role"] != "caregiver":
        raise ForbiddenException(message="This action requires a caregiver account.")
    return current_user
