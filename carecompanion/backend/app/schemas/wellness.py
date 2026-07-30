"""
Wellness schemas.

Daily check-in and history response models.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class WellnessCheckCreate(BaseModel):
    """Daily wellness check-in request."""
    mood: Optional[str] = Field(None, max_length=50)
    sleep_hours: Optional[int] = Field(None, ge=0, le=24)
    energy: Optional[str] = Field(None, max_length=30)
    pain_level: Optional[int] = Field(None, ge=0, le=10)
    notes: Optional[str] = None


class WellnessCheckResponse(BaseModel):
    """Wellness check-in response."""
    id: int
    mood: Optional[str] = None
    sleep_hours: Optional[int] = None
    energy_level: Optional[str] = None
    pain_level: Optional[int] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
