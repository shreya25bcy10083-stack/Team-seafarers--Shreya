"""
Patient model.

Table: patients
Purpose: Stores patient-specific information.
Relationship: One User → One Patient
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class Patient(Base):
    """SQLAlchemy model for the patients table."""

    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    blood_group = Column(String(5), nullable=True)
    emergency_contact = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="patient")
    medications = relationship("Medication", back_populates="patient", cascade="all, delete-orphan")
    wellness_checks = relationship("WellnessCheck", back_populates="patient", cascade="all, delete-orphan")
    medical_reports = relationship("MedicalReport", back_populates="patient", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="patient", cascade="all, delete-orphan")
    sos_events = relationship("SOSEvent", back_populates="patient", cascade="all, delete-orphan")
    patient_caregivers = relationship("PatientCaregiver", back_populates="patient", cascade="all, delete-orphan")
