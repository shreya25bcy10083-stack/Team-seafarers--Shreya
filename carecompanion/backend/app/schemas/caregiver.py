"""
Caregiver schemas.

Join request and dashboard response models.
"""

from pydantic import BaseModel, Field
from typing import Optional


class CaregiverJoinRequest(BaseModel):
    """Caregiver join via invite code."""
    invite_code: str = Field(..., min_length=1, max_length=20)


class DashboardResponse(BaseModel):
    """Caregiver dashboard response."""
    patient_name: str
    medication_adherence: float
    today_status: str


class PatientDetailResponse(BaseModel):
    """Detailed patient info for caregiver."""
    id: int
    name: str
    age: Optional[int] = None
    blood_group: Optional[str] = None
    medication_adherence: float = 0.0
    today_status: str = "Unknown"
