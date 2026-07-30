"""
Medication Service.

Business logic for medication CRUD and adherence logging.
"""

from sqlalchemy.orm import Session
from app.repositories.medication_repository import MedicationRepository
from app.repositories.patient_repository import PatientRepository
from app.core.exceptions import NotFoundException, ForbiddenException


class MedicationService:
    """Handles medication management and adherence tracking."""

    def __init__(self, db: Session):
        self.med_repo = MedicationRepository(db)
        self.patient_repo = PatientRepository(db)

    def _get_patient_id(self, user_id: int) -> int:
        """Helper to get patient ID from user ID."""
        patient = self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise NotFoundException(message="Patient profile not found.")
        return patient.id

    def get_medications(self, user_id: int) -> list[dict]:
        """Get all medications for the current patient."""
        patient_id = self._get_patient_id(user_id)
        medications = self.med_repo.get_by_patient_id(patient_id)

        return [
            {
                "id": m.id,
                "name": m.medicine_name,
                "dosage": m.dosage,
                "time": m.reminder_time.strftime("%H:%M") if m.reminder_time else None,
                "status": "pending",
            }
            for m in medications
        ]

    def add_medication(self, user_id: int, name: str, **kwargs) -> dict:
        """Add a new medication."""
        patient_id = self._get_patient_id(user_id)
        medication = self.med_repo.create(patient_id=patient_id, medicine_name=name, **kwargs)

        return {
            "id": medication.id,
            "name": medication.medicine_name,
            "dosage": medication.dosage,
            "time": medication.reminder_time.strftime("%H:%M") if medication.reminder_time else None,
            "status": "pending",
        }

    def update_medication(self, user_id: int, medication_id: int, **kwargs) -> dict:
        """Update an existing medication."""
        patient_id = self._get_patient_id(user_id)
        medication = self.med_repo.get_by_id(medication_id)

        if not medication:
            raise NotFoundException(message="Medication not found.")
        if medication.patient_id != patient_id:
            raise ForbiddenException(message="You do not own this medication.")

        # Map 'name' to 'medicine_name' if provided
        if "name" in kwargs and kwargs["name"]:
            kwargs["medicine_name"] = kwargs.pop("name")
        else:
            kwargs.pop("name", None)

        medication = self.med_repo.update(medication, **kwargs)
        return {
            "id": medication.id,
            "name": medication.medicine_name,
            "dosage": medication.dosage,
            "time": medication.reminder_time.strftime("%H:%M") if medication.reminder_time else None,
            "status": "pending",
        }

    def delete_medication(self, user_id: int, medication_id: int) -> None:
        """Delete a medication."""
        patient_id = self._get_patient_id(user_id)
        medication = self.med_repo.get_by_id(medication_id)

        if not medication:
            raise NotFoundException(message="Medication not found.")
        if medication.patient_id != patient_id:
            raise ForbiddenException(message="You do not own this medication.")

        self.med_repo.delete(medication)

    def log_medication(self, user_id: int, medication_id: int, status: str) -> dict:
        """Log a medication action (taken/missed/snoozed)."""
        patient_id = self._get_patient_id(user_id)
        medication = self.med_repo.get_by_id(medication_id)

        if not medication:
            raise NotFoundException(message="Medication not found.")
        if medication.patient_id != patient_id:
            raise ForbiddenException(message="You do not own this medication.")

        log = self.med_repo.create_log(medication_id=medication_id, status=status)
        return {"medication_id": medication_id, "status": status}
