"""
Wellness Service.

Business logic for daily wellness check-ins.
"""

from sqlalchemy.orm import Session
from app.repositories.wellness_repository import WellnessRepository
from app.repositories.patient_repository import PatientRepository
from app.core.exceptions import NotFoundException


from app.repositories.activity_repository import ActivityRepository


class WellnessService:
    """Handles daily wellness check-ins and history."""

    def __init__(self, db: Session):
        self.wellness_repo = WellnessRepository(db)
        self.patient_repo = PatientRepository(db)
        self.activity_repo = ActivityRepository(db)

    def checkin(self, user_id: int, **kwargs) -> dict:
        """
        Record a daily wellness check-in.

        Accepts mood, sleep_hours, energy, pain_level, notes.
        """
        patient = self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise NotFoundException(message="Patient profile not found.")

        # Map 'energy' to 'energy_level' for the model
        if "energy" in kwargs:
            kwargs["energy_level"] = kwargs.pop("energy")

        check = self.wellness_repo.create(patient_id=patient.id, **kwargs)

        self.activity_repo.create_log(
            patient_id=patient.id,
            event_type="wellness",
            title="Wellness Check Completed",
            description=f"Mood: {check.mood or 'N/A'}, Energy: {check.energy_level or 'N/A'}, Pain: {check.pain_level if check.pain_level is not None else 'N/A'}/10",
        )

        return {
            "id": check.id,
            "mood": check.mood,
            "sleep_hours": check.sleep_hours,
            "energy_level": check.energy_level,
            "pain_level": check.pain_level,
            "notes": check.notes,
        }

    def get_history(self, user_id: int) -> list[dict]:
        """Get wellness check-in history for a patient."""
        patient = self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise NotFoundException(message="Patient profile not found.")

        checks = self.wellness_repo.get_by_patient_id(patient.id)
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
