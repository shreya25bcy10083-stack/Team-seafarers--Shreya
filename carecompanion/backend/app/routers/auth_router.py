"""
Auth Router.

Endpoints: POST /auth/register, POST /auth/login, POST /auth/logout
Routers only receive requests, validate, call services, return responses.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest
from app.services.auth_service import AuthService
from app.utils.response_builder import success_response

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user (patient or caregiver)."""
    service = AuthService(db)
    user_id = service.register(
        name=request.name,
        email=request.email,
        password=request.password,
        role=request.role,
    )
    return success_response(
        data={"user_id": user_id},
        message="Registration successful.",
    )


@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate a user and return a JWT token."""
    service = AuthService(db)
    result = service.login(email=request.email, password=request.password)
    return success_response(
        data=result,
        message="Login successful.",
    )


@router.post("/logout")
def logout():
    """Logout the current user (client-side token removal)."""
    return success_response(message="Logout successful.")
