"""
Medication Service.

Business logic for medication CRUD and adherence logging.
"""

from sqlalchemy.orm import Session
from app.repositories.medication_repository import MedicationRepository
from app.repositories.patient_repository import PatientRepository
from app.core.exceptions import NotFoundException, ForbiddenException


from app.repositories.activity_repository import ActivityRepository


from app.utils.patient_resolver import resolve_patient_id


class MedicationService:
    """Handles medication management and adherence tracking."""

    def __init__(self, db: Session):
        self.db = db
        self.med_repo = MedicationRepository(db)
        self.patient_repo = PatientRepository(db)
        self.activity_repo = ActivityRepository(db)

    def get_medications(self, current_user: dict) -> list[dict]:
        """Get all medications for the current patient or caregiver's linked patient."""
        patient_id = resolve_patient_id(self.db, current_user)
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

    def add_medication(self, current_user: dict, name: str, **kwargs) -> dict:
        """Add a new medication for current patient or caregiver's linked patient."""
        patient_id = resolve_patient_id(self.db, current_user)
        medication = self.med_repo.create(patient_id=patient_id, medicine_name=name, **kwargs)

        creator_label = "Caregiver" if current_user.get("role") == "caregiver" else "Patient"
        self.activity_repo.create_log(
            patient_id=patient_id,
            event_type="medication",
            title=f"Medication Scheduled by {creator_label}: {name}",
            description=f"Dosage: {kwargs.get('dosage', 'N/A')}",
        )

        return {
            "id": medication.id,
            "name": medication.medicine_name,
            "dosage": medication.dosage,
            "time": medication.reminder_time.strftime("%H:%M") if medication.reminder_time else None,
            "status": "pending",
        }

    def update_medication(self, current_user: dict, medication_id: int, **kwargs) -> dict:
        """Update an existing medication."""
        patient_id = resolve_patient_id(self.db, current_user)
        medication = self.med_repo.get_by_id(medication_id)

        if not medication:
            raise NotFoundException(message="Medication not found.")
        if medication.patient_id != patient_id:
            raise ForbiddenException(message="You do not have access to this medication.")

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

    def delete_medication(self, current_user: dict, medication_id: int) -> None:
        """Delete a medication."""
        patient_id = resolve_patient_id(self.db, current_user)
        medication = self.med_repo.get_by_id(medication_id)

        if not medication:
            raise NotFoundException(message="Medication not found.")
        if medication.patient_id != patient_id:
            raise ForbiddenException(message="You do not have access to this medication.")

        self.med_repo.delete(medication)

    def log_medication(self, current_user: dict, medication_id: int, status: str) -> dict:
        """Log a medication action (taken/missed/snoozed)."""
        patient_id = resolve_patient_id(self.db, current_user)
        medication = self.med_repo.get_by_id(medication_id)

        if not medication:
            raise NotFoundException(message="Medication not found.")
        if medication.patient_id != patient_id:
            raise ForbiddenException(message="You do not have access to this medication.")

        log = self.med_repo.create_log(medication_id=medication_id, status=status)

        status_title = "Medication Taken" if status == "taken" else f"Medication {status.capitalize()}"
        actor = "Caregiver" if current_user.get("role") == "caregiver" else "Patient"
        self.activity_repo.create_log(
            patient_id=patient_id,
            event_type="medication",
            title=f"{status_title} ({actor}): {medication.medicine_name}",
            description=f"Status: {status.upper()}",
        )

        return {"medication_id": medication_id, "status": status}
