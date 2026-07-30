"""
Medication Repository.

Database operations for medications and medication_logs tables.
"""

from datetime import datetime, time
from sqlalchemy.orm import Session
from app.models.medication import Medication
from app.models.medication_log import MedicationLog


class MedicationRepository:
    """Database access for Medication and MedicationLog models."""

    def __init__(self, db: Session):
        self.db = db

    def get_by_patient_id(self, patient_id: int) -> list[Medication]:
        """Get all medications for a patient."""
        return self.db.query(Medication).filter(Medication.patient_id == patient_id).all()

    def get_by_id(self, medication_id: int) -> Medication | None:
        """Get medication by ID."""
        return self.db.query(Medication).filter(Medication.id == medication_id).first()

    def create(self, patient_id: int, medicine_name: str, **kwargs) -> Medication:
        """Create a new medication."""
        # Parse time string to time object if provided
        reminder_time = None
        time_str = kwargs.pop("time", None)
        if time_str:
            try:
                parts = time_str.split(":")
                reminder_time = time(int(parts[0]), int(parts[1]))
            except (ValueError, IndexError):
                pass

        medication = Medication(
            patient_id=patient_id,
            medicine_name=medicine_name,
            dosage=kwargs.get("dosage"),
            frequency=kwargs.get("frequency"),
            reminder_time=reminder_time,
            instructions=kwargs.get("instructions"),
        )
        self.db.add(medication)
        self.db.commit()
        self.db.refresh(medication)
        return medication

    def update(self, medication: Medication, **kwargs) -> Medication:
        """Update medication fields."""
        # Handle time field separately
        time_str = kwargs.pop("time", None)
        if time_str:
            try:
                parts = time_str.split(":")
                medication.reminder_time = time(int(parts[0]), int(parts[1]))
            except (ValueError, IndexError):
                pass

        for key, value in kwargs.items():
            if value is not None and hasattr(medication, key):
                setattr(medication, key, value)
        self.db.commit()
        self.db.refresh(medication)
        return medication

    def delete(self, medication: Medication) -> None:
        """Delete a medication."""
        self.db.delete(medication)
        self.db.commit()

    def create_log(self, medication_id: int, status: str) -> MedicationLog:
        """Log a medication action (taken/missed/snoozed)."""
        log = MedicationLog(medication_id=medication_id, status=status)
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log

    def get_logs_by_patient(self, patient_id: int) -> list[MedicationLog]:
        """Get all medication logs for a patient's medications."""
        medication_ids = [
            m.id for m in self.get_by_patient_id(patient_id)
        ]
        if not medication_ids:
            return []
        return (
            self.db.query(MedicationLog)
            .filter(MedicationLog.medication_id.in_(medication_ids))
            .all()
        )
