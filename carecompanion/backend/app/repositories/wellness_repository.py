"""
Wellness Repository.

Database operations for wellness_checks table.
"""

from sqlalchemy.orm import Session
from app.models.wellness_check import WellnessCheck


class WellnessRepository:
    """Database access for WellnessCheck model."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, patient_id: int, **kwargs) -> WellnessCheck:
        """Create a new wellness check-in."""
        check = WellnessCheck(patient_id=patient_id, **kwargs)
        self.db.add(check)
        self.db.commit()
        self.db.refresh(check)
        return check

    def get_by_patient_id(self, patient_id: int) -> list[WellnessCheck]:
        """Get all wellness checks for a patient, newest first."""
        return (
            self.db.query(WellnessCheck)
            .filter(WellnessCheck.patient_id == patient_id)
            .order_by(WellnessCheck.created_at.desc())
            .all()
        )

    def get_latest(self, patient_id: int) -> WellnessCheck | None:
        """Get the most recent wellness check."""
        return (
            self.db.query(WellnessCheck)
            .filter(WellnessCheck.patient_id == patient_id)
            .order_by(WellnessCheck.created_at.desc())
            .first()
        )
