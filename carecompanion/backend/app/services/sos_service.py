"""
SOS Service.

Business logic for emergency SOS triggers.
"""

from sqlalchemy.orm import Session
from app.repositories.sos_repository import SOSRepository
from app.repositories.patient_repository import PatientRepository
from app.repositories.notification_repository import NotificationRepository
from app.core.exceptions import NotFoundException


from app.repositories.activity_repository import ActivityRepository


class SOSService:
    """Handles SOS emergency triggers and notifications."""

    def __init__(self, db: Session):
        self.sos_repo = SOSRepository(db)
        self.patient_repo = PatientRepository(db)
        self.notification_repo = NotificationRepository(db)
        self.activity_repo = ActivityRepository(db)

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

        # Create emergency notification for patient
        self.notification_repo.create(
            patient_id=patient.id,
            title="🚨 SOS Emergency Triggered",
            description=f"Emergency alert sent. Location: {latitude or 'N/A'}, {longitude or 'N/A'}",
            type="emergency",
        )

        self.activity_repo.create_log(
            patient_id=patient.id,
            event_type="sos",
            title="🚨 SOS Emergency Triggered",
            description=f"Patient {patient.user.full_name} pressed SOS button. Location: {latitude or 'N/A'}, {longitude or 'N/A'}",
        )

        # Notify linked caregivers
        from app.repositories.caregiver_repository import CaregiverRepository
        caregiver_repo = CaregiverRepository(self.patient_repo.db)
        links = caregiver_repo.get_caregivers_for_patient(patient.id)
        for link in links:
            if link.caregiver and link.caregiver.user:
                self.notification_repo.create(
                    patient_id=patient.id,
                    title=f"🚨 EMERGENCY: {patient.user.full_name} Triggered SOS",
                    description=f"Immediate attention required! Location: {latitude or 'N/A'}, {longitude or 'N/A'}",
                    type="emergency",
                )

        return {
            "id": event.id,
            "status": event.status,
            "message": "Emergency alert sent to caregiver and response contacts.",
        }
