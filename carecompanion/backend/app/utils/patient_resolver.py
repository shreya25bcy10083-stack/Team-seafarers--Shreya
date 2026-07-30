"""
Patient Resolver Utility.

Resolves target patient_id for authenticated user regardless of whether
the user role is 'patient' or 'caregiver'.
"""

from sqlalchemy.orm import Session
from app.repositories.patient_repository import PatientRepository
from app.repositories.caregiver_repository import CaregiverRepository
from app.core.exceptions import NotFoundException, BadRequestException


def resolve_patient_id(db: Session, current_user: dict | int, target_patient_id: int | None = None) -> int:
    """
    Get patient_id associated with current authenticated user.

    If role is 'patient', returns current user's patient ID.
    If role is 'caregiver', returns linked patient ID.
    """
    if isinstance(current_user, int):
        user_id = current_user
        role = "patient"
    else:
        user_id = current_user.get("user_id") if isinstance(current_user, dict) else current_user
        role = current_user.get("role", "patient") if isinstance(current_user, dict) else "patient"

    if role == "patient" or not role:
        patient_repo = PatientRepository(db)
        patient = patient_repo.get_by_user_id(user_id)
        if not patient:
            raise NotFoundException(message="Patient profile not found.")
        return patient.id

    if role == "caregiver":
        caregiver_repo = CaregiverRepository(db)
        caregiver = caregiver_repo.get_by_user_id(user_id)
        if not caregiver:
            raise NotFoundException(message="Caregiver profile not found.")

        links = caregiver_repo.get_patients_for_caregiver(caregiver.id)
        if not links:
            raise BadRequestException(message="No patient linked to this caregiver account.")

        if target_patient_id:
            link = next((l for l in links if l.patient_id == target_patient_id), None)
            if not link:
                raise BadRequestException(message="Target patient is not linked to this caregiver.")
            return link.patient_id

        return links[0].patient_id

    raise BadRequestException(message="Invalid user role for patient data access.")
