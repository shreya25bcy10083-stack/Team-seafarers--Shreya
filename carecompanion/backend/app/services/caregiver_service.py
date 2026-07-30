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

    def _get_linked_patient_id(self, caregiver_user_id: int, patient_id: int | None = None) -> int:
        """Verify caregiver profile and get linked patient ID."""
        caregiver = self.caregiver_repo.get_by_user_id(caregiver_user_id)
        if not caregiver:
            raise NotFoundException(message="Caregiver profile not found.")

        links = self.caregiver_repo.get_patients_for_caregiver(caregiver.id)
        if not links:
            raise BadRequestException(message="No patient linked to this caregiver.")

        if patient_id:
            # Check specific link
            link = next((l for l in links if l.patient_id == patient_id), None)
            if not link:
                raise BadRequestException(message="Patient is not linked to this caregiver.")
            return link.patient_id

        return links[0].patient_id

    def add_patient_medication(self, caregiver_user_id: int, patient_id: int, name: str, **kwargs) -> dict:
        """Caregiver creates a medication schedule for linked patient."""
        target_patient_id = self._get_linked_patient_id(caregiver_user_id, patient_id)
        from app.services.medication_service import MedicationService
        med_service = MedicationService(self.patient_repo.db)
        # Add medication on behalf of patient
        med = self.medication_repo.create(patient_id=target_patient_id, medicine_name=name, **kwargs)

        from app.repositories.activity_repository import ActivityRepository
        ActivityRepository(self.patient_repo.db).create_log(
            patient_id=target_patient_id,
            event_type="medication",
            title=f"Medication Scheduled by Caregiver: {name}",
            description=f"Dosage: {kwargs.get('dosage', 'N/A')}",
        )

        return {
            "id": med.id,
            "name": med.medicine_name,
            "dosage": med.dosage,
            "time": med.reminder_time.strftime("%H:%M") if med.reminder_time else None,
            "status": "pending",
        }

    def update_patient_medication(self, caregiver_user_id: int, medication_id: int, **kwargs) -> dict:
        """Caregiver updates a medication schedule."""
        medication = self.medication_repo.get_by_id(medication_id)
        if not medication:
            raise NotFoundException(message="Medication not found.")

        self._get_linked_patient_id(caregiver_user_id, medication.patient_id)

        if "name" in kwargs and kwargs["name"]:
            kwargs["medicine_name"] = kwargs.pop("name")
        else:
            kwargs.pop("name", None)

        medication = self.medication_repo.update(medication, **kwargs)
        return {
            "id": medication.id,
            "name": medication.medicine_name,
            "dosage": medication.dosage,
            "time": medication.reminder_time.strftime("%H:%M") if medication.reminder_time else None,
            "status": "pending",
        }

    def delete_patient_medication(self, caregiver_user_id: int, medication_id: int) -> None:
        """Caregiver deletes a medication schedule."""
        medication = self.medication_repo.get_by_id(medication_id)
        if not medication:
            raise NotFoundException(message="Medication not found.")

        self._get_linked_patient_id(caregiver_user_id, medication.patient_id)
        self.medication_repo.delete(medication)

    def get_patient_activity(self, caregiver_user_id: int) -> list[dict]:
        """Get recent activity timeline feed for caregiver dashboard."""
        patient_id = self._get_linked_patient_id(caregiver_user_id)
        from app.repositories.activity_repository import ActivityRepository
        activity_repo = ActivityRepository(self.patient_repo.db)
        logs = activity_repo.get_patient_activity(patient_id, limit=30)

        return [
            {
                "id": a.id,
                "event_type": a.event_type,
                "title": a.title,
                "description": a.description,
                "created_at": a.created_at.isoformat() if a.created_at else None,
            }
            for a in logs
        ]

    def get_patient_wellness(self, caregiver_user_id: int) -> list[dict]:
        """Get wellness check history for caregiver view."""
        patient_id = self._get_linked_patient_id(caregiver_user_id)
        checks = self.wellness_repo.get_by_patient_id(patient_id)

        return [
            {
                "id": c.id,
                "mood": c.mood,
                "sleep_hours": c.sleep_hours,
                "energy_level": c.energy_level,
                "pain_level": c.pain_level,
                "notes": c.notes,
                "created_at": c.created_at.isoformat() if c.created_at else None,
            }
            for c in checks
        ]
