"""
Report schemas.

Response model for medical reports.
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReportResponse(BaseModel):
    """Medical report response."""
    id: int
    report_name: str
    report_url: str
    ai_summary: Optional[str] = None
    uploaded_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
