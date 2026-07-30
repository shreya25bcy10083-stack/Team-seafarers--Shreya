"""
PatientCaregiver model.

Table: patient_caregivers
Purpose: Many-to-many link between patients and caregivers via invite codes.
Status: pending | accepted | rejected
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class PatientCaregiver(Base):
    """SQLAlchemy model for the patient_caregivers table."""

    __tablename__ = "patient_caregivers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    caregiver_id = Column(Integer, ForeignKey("caregivers.id", ondelete="CASCADE"), nullable=True)
    invite_code = Column(String(20), nullable=False, index=True)
    status = Column(String(20), nullable=False, default="pending")  # pending | accepted | rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    patient = relationship("Patient", back_populates="patient_caregivers")
    caregiver = relationship("Caregiver", back_populates="patient_caregivers")
