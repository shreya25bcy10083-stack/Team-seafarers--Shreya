"""
AI schemas.

Request/response models for AI chat and report summary.
"""

from pydantic import BaseModel, Field
from typing import Optional


class ChatRequest(BaseModel):
    """AI chat request."""
    message: str = Field(..., min_length=1, description="User message")


class ChatResponse(BaseModel):
    """AI chat response."""
    reply: str
    tips: list[str] = []
    warning: str = ""
    disclaimer: str = ""


class ReportSummaryResponse(BaseModel):
    """AI report summary response."""
    summary: str
    tips: list[str] = []
    warning: str = ""
    disclaimer: str = ""
