"""
Medication schemas.

CRUD and logging schemas for medications.
"""

from pydantic import BaseModel, Field
from typing import Optional


class MedicationCreate(BaseModel):
    """Create medication request."""
    name: str = Field(..., min_length=1, max_length=100, alias="name")
    dosage: Optional[str] = Field(None, max_length=50)
    frequency: Optional[str] = Field(None, max_length=50)
    time: Optional[str] = Field(None, description="Reminder time in HH:MM format")
    instructions: Optional[str] = None


class MedicationUpdate(BaseModel):
    """Update medication request."""
    name: Optional[str] = Field(None, max_length=100)
    dosage: Optional[str] = Field(None, max_length=50)
    frequency: Optional[str] = Field(None, max_length=50)
    time: Optional[str] = Field(None, description="Reminder time in HH:MM format")
    instructions: Optional[str] = None


class MedicationResponse(BaseModel):
    """Medication response."""
    id: int
    name: str
    dosage: Optional[str] = None
    time: Optional[str] = None
    status: str = "pending"

    model_config = {"from_attributes": True}


class MedicationLogCreate(BaseModel):
    """Log medication action."""
    medication_id: int
    status: str = Field(..., pattern="^(taken|missed|snoozed|skipped)$")
