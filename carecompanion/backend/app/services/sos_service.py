"""
SOS Service.

Business logic for emergency SOS triggers.
"""

from sqlalchemy.orm import Session
from app.repositories.sos_repository import SOSRepository
from app.repositories.patient_repository import PatientRepository
from app.repositories.notification_repository import NotificationRepository
from app.core.exceptions import NotFoundException


class SOSService:
    """Handles SOS emergency triggers and notifications."""

    def __init__(self, db: Session):
        self.sos_repo = SOSRepository(db)
        self.patient_repo = PatientRepository(db)
        self.notification_repo = NotificationRepository(db)

    def trigger_sos(self, user_id: int, latitude: float | None = None, longitude: float | None = None) -> dict:
        """
        Trigger an SOS emergency event.

        Creates an SOS event and sends a notification.
        """
        patient = self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise NotFoundException(message="Patient profile not found.")

        # Create SOS event
        event = self.sos_repo.create(
            patient_id=patient.id,
            latitude=latitude,
            longitude=longitude,
        )

        # Create emergency notification
        self.notification_repo.create(
            patient_id=patient.id,
            title="🚨 SOS Emergency Triggered",
            description=f"Emergency alert sent. Location: {latitude}, {longitude}",
            type="emergency",
        )

        return {
            "id": event.id,
            "status": event.status,
            "message": "Emergency alert sent.",
        }
