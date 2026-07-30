"""
Medication model.

Table: medications
Purpose: Stores medication schedules.
Relationship: One Patient → Many Medications
"""

from sqlalchemy import Column, Integer, String, Time, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class Medication(Base):
    """SQLAlchemy model for the medications table."""

    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    medicine_name = Column(String(100), nullable=False)
    dosage = Column(String(50), nullable=True)
    frequency = Column(String(50), nullable=True)
    reminder_time = Column(Time, nullable=True)
    instructions = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    patient = relationship("Patient", back_populates="medications")
    logs = relationship("MedicationLog", back_populates="medication", cascade="all, delete-orphan")
