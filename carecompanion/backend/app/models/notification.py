"""
Notification model.

Table: notifications
Purpose: Stores reminders and alerts.
Types: medication | wellness | report | emergency | system
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class Notification(Base):
    """SQLAlchemy model for the notifications table."""

    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(String(30), nullable=False)  # medication | wellness | report | emergency | system
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    patient = relationship("Patient", back_populates="notifications")
