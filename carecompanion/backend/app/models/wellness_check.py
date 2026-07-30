"""
WellnessCheck model.

Table: wellness_checks
Purpose: Stores daily wellness information.
Relationship: One Patient → Many Wellness Records
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class WellnessCheck(Base):
    """SQLAlchemy model for the wellness_checks table."""

    __tablename__ = "wellness_checks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    mood = Column(String(50), nullable=True)
    sleep_hours = Column(Integer, nullable=True)
    energy_level = Column(String(30), nullable=True)
    pain_level = Column(Integer, nullable=True)  # 0–10
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    patient = relationship("Patient", back_populates="wellness_checks")
