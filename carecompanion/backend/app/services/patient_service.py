"""
Patient Service.

Business logic for patient profile and invite codes.
"""

import secrets
from sqlalchemy.orm import Session
from app.repositories.patient_repository import PatientRepository
from app.repositories.caregiver_repository import CaregiverRepository
from app.models.patient_caregiver import PatientCaregiver
from app.core.exceptions import NotFoundException


class PatientService:
    """Handles patient profile and invite code operations."""

    def __init__(self, db: Session):
        self.db = db
        self.patient_repo = PatientRepository(db)
        self.caregiver_repo = CaregiverRepository(db)

    def get_profile(self, user_id: int) -> dict:
        """
        Get patient profile.

        Returns:
            Dict with patient profile data.
        """
        patient = self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise NotFoundException(message="Patient profile not found.")

        return {
            "id": patient.id,
            "name": patient.user.full_name,
            "age": patient.age,
            "blood_group": patient.blood_group,
        }

    def update_profile(self, user_id: int, **kwargs) -> dict:
        """Update patient profile fields."""
        patient = self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise NotFoundException(message="Patient profile not found.")

        patient = self.patient_repo.update(patient, **kwargs)
        return {
            "id": patient.id,
            "name": patient.user.full_name,
            "age": patient.age,
            "blood_group": patient.blood_group,
        }

    def generate_invite_code(self, user_id: int) -> str:
        """
        Generate a unique invite code for caregiver linking.

        Creates a PatientCaregiver record with status 'pending'.
        """
        patient = self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise NotFoundException(message="Patient profile not found.")

        invite_code = secrets.token_urlsafe(6).upper()[:8]

        # Create pending link entry with nullable caregiver_id
        link = PatientCaregiver(
            patient_id=patient.id,
            caregiver_id=None,
            invite_code=invite_code,
            status="pending",
        )
        self.db.add(link)
        self.db.commit()

        return invite_code

