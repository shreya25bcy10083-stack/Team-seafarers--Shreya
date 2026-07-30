"""
Notification schemas.

Response model for notifications.
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class NotificationResponse(BaseModel):
    """Notification response."""
    id: int
    title: str
    description: Optional[str] = None
    type: str
    is_read: bool = False
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
