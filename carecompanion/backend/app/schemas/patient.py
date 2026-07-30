"""
Patient schemas.

Create, update, and response models for patient profile.
"""

from pydantic import BaseModel, Field
from typing import Optional


class PatientCreate(BaseModel):
    """Patient profile creation schema."""
    age: Optional[int] = Field(None, ge=0, le=150)
    gender: Optional[str] = Field(None, max_length=20)
    blood_group: Optional[str] = Field(None, max_length=5)
    emergency_contact: Optional[str] = Field(None, max_length=20)


class PatientUpdate(BaseModel):
    """Patient profile update schema."""
    age: Optional[int] = Field(None, ge=0, le=150)
    gender: Optional[str] = Field(None, max_length=20)
    blood_group: Optional[str] = Field(None, max_length=5)
    emergency_contact: Optional[str] = Field(None, max_length=20)


class PatientResponse(BaseModel):
    """Patient profile response."""
    id: int
    name: str
    age: Optional[int] = None
    blood_group: Optional[str] = None

    model_config = {"from_attributes": True}


class InviteCodeResponse(BaseModel):
    """Invite code response."""
    invite_code: str
