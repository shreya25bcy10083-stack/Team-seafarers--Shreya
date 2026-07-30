"""
SOS Repository.

Database operations for sos_events table.
"""

from sqlalchemy.orm import Session
from app.models.sos_event import SOSEvent


class SOSRepository:
    """Database access for SOSEvent model."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, patient_id: int, latitude: float | None = None, longitude: float | None = None) -> SOSEvent:
        """Create a new SOS event."""
        event = SOSEvent(
            patient_id=patient_id,
            latitude=latitude,
            longitude=longitude,
            status="triggered",
        )
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        return event

    def get_by_patient_id(self, patient_id: int) -> list[SOSEvent]:
        """Get all SOS events for a patient."""
        return (
            self.db.query(SOSEvent)
            .filter(SOSEvent.patient_id == patient_id)
            .order_by(SOSEvent.created_at.desc())
            .all()
        )
