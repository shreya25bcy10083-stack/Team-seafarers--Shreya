"""
Authentication schemas.

Request/response models for register, login, logout.
"""

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    """Registration request schema."""
    name: str = Field(..., min_length=1, max_length=100, description="Full name")
    email: EmailStr = Field(..., description="Email address")
    password: str = Field(..., min_length=6, description="Password")
    role: str = Field(..., pattern="^(patient|caregiver)$", description="User role: patient or caregiver")


class LoginRequest(BaseModel):
    """Login request schema."""
    email: EmailStr = Field(..., description="Email address")
    password: str = Field(..., description="Password")


class TokenResponse(BaseModel):
    """Token response after login."""
    token: str
    role: str


class UserResponse(BaseModel):
    """Basic user info response."""
    user_id: int
