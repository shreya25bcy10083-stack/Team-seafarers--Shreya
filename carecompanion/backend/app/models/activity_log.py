"""
ActivityLog model.

Table: activity_logs
Purpose: Stores chronological timeline of patient events for Caregiver Dashboard.
Event Types: medication | wellness | report | ai | sos
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class ActivityLog(Base):
    """SQLAlchemy model for the activity_logs table."""

    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    event_type = Column(String(30), nullable=False)  # medication | wellness | report | ai | sos
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship back to patient
    patient = relationship("Patient", backref="activity_logs")
