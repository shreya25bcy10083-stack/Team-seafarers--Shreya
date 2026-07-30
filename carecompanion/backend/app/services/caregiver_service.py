"""
Caregiver Service.

Business logic for caregiver linking and dashboard.
"""

from sqlalchemy.orm import Session
from app.repositories.caregiver_repository import CaregiverRepository
from app.repositories.patient_repository import PatientRepository
from app.repositories.medication_repository import MedicationRepository
from app.repositories.wellness_repository import WellnessRepository
from app.core.exceptions import NotFoundException, BadRequestException


class CaregiverService:
    """Handles caregiver joining, dashboard, and patient monitoring."""

    def __init__(self, db: Session):
        self.caregiver_repo = CaregiverRepository(db)
        self.patient_repo = PatientRepository(db)
        self.medication_repo = MedicationRepository(db)
        self.wellness_repo = WellnessRepository(db)

    def join_patient(self, user_id: int, invite_code: str) -> dict:
        """
        Link a caregiver to a patient via invite code.

        Returns:
            Success message.
        """
        caregiver = self.caregiver_repo.get_by_user_id(user_id)
        if not caregiver:
            raise NotFoundException(message="Caregiver profile not found.")

        link = self.caregiver_repo.get_link_by_invite_code(invite_code)
        if not link:
            raise BadRequestException(message="Invalid invite code.")

        if link.status == "accepted":
            raise BadRequestException(message="Invite code has already been used.")

        # Update the link with actual caregiver ID
        link.caregiver_id = caregiver.id
        link.status = "accepted"
        self.caregiver_repo.db.commit()

        return {"message": "Successfully linked to patient."}

    def get_dashboard(self, user_id: int) -> dict:
        """
        Get caregiver dashboard data.

        Returns:
            Dict with patient summary.
        """
        caregiver = self.caregiver_repo.get_by_user_id(user_id)
        if not caregiver:
            raise NotFoundException(message="Caregiver profile not found.")

        links = self.caregiver_repo.get_patients_for_caregiver(caregiver.id)
        if not links:
            return {
                "patient_name": "No patient linked",
                "medication_adherence": 0,
                "today_status": "Unknown",
            }

        # Get first linked patient's data
        link = links[0]
        patient = self.patient_repo.get_by_id(link.patient_id)
        if not patient:
            raise NotFoundException(message="Patient not found.")

        # Calculate medication adherence
        medications = self.medication_repo.get_by_patient_id(patient.id)
        logs = self.medication_repo.get_logs_by_patient(patient.id)
        total_meds = len(medications) if medications else 1
        taken_logs = len([l for l in logs if l.status == "taken"])
        adherence = round((taken_logs / max(total_meds, 1)) * 100, 1)

        # Get latest wellness status
        latest_wellness = self.wellness_repo.get_latest(patient.id)
        today_status = latest_wellness.mood if latest_wellness else "No check-in"

        return {
            "patient_name": patient.user.full_name,
            "medication_adherence": adherence,
            "today_status": today_status,
        }

    def get_patient_details(self, user_id: int, patient_id: int) -> dict:
        """Get detailed patient info for caregiver view."""
        caregiver = self.caregiver_repo.get_by_user_id(user_id)
        if not caregiver:
            raise NotFoundException(message="Caregiver profile not found.")

        patient = self.patient_repo.get_by_id(patient_id)
        if not patient:
            raise NotFoundException(message="Patient not found.")

        return {
            "id": patient.id,
            "name": patient.user.full_name,
            "age": patient.age,
            "blood_group": patient.blood_group,
        }
