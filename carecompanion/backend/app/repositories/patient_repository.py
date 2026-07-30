"""
Patient Repository.

Database operations for the patients table.
"""

from sqlalchemy.orm import Session
from app.models.patient import Patient


class PatientRepository:
    """Database access for Patient model."""

    def __init__(self, db: Session):
        self.db = db

    def get_by_user_id(self, user_id: int) -> Patient | None:
        """Fetch patient by user ID."""
        return self.db.query(Patient).filter(Patient.user_id == user_id).first()

    def get_by_id(self, patient_id: int) -> Patient | None:
        """Fetch patient by patient ID."""
        return self.db.query(Patient).filter(Patient.id == patient_id).first()

    def create(self, user_id: int, **kwargs) -> Patient:
        """Create a new patient profile."""
        patient = Patient(user_id=user_id, **kwargs)
        self.db.add(patient)
        self.db.commit()
        self.db.refresh(patient)
        return patient

    def update(self, patient: Patient, **kwargs) -> Patient:
        """Update patient profile fields."""
        for key, value in kwargs.items():
            if value is not None and hasattr(patient, key):
                setattr(patient, key, value)
        self.db.commit()
        self.db.refresh(patient)
        return patient
