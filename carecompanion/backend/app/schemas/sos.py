"""
SOS schemas.

Request/response models for emergency SOS.
"""

from pydantic import BaseModel
from typing import Optional


class SOSCreate(BaseModel):
    """SOS trigger request."""
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class SOSResponse(BaseModel):
    """SOS event response."""
    id: int
    status: str
    message: str = "Emergency alert sent."
