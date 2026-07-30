"""
Notification Service.

Business logic for notifications.
"""

from sqlalchemy.orm import Session
from app.repositories.notification_repository import NotificationRepository
from app.repositories.patient_repository import PatientRepository
from app.core.exceptions import NotFoundException


class NotificationService:
    """Handles notification creation and retrieval."""

    def __init__(self, db: Session):
        self.notification_repo = NotificationRepository(db)
        self.patient_repo = PatientRepository(db)

    def get_notifications(self, user_id: int) -> list[dict]:
        """Get all notifications for the current patient."""
        patient = self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise NotFoundException(message="Patient profile not found.")

        notifications = self.notification_repo.get_by_patient_id(patient.id)
        return [
            {
                "id": n.id,
                "title": n.title,
                "description": n.description,
                "type": n.type,
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat() if n.created_at else None,
            }
            for n in notifications
        ]

    def mark_as_read(self, notification_id: int) -> dict:
        """Mark a notification as read."""
        notification = self.notification_repo.mark_as_read(notification_id)
        if not notification:
            raise NotFoundException(message="Notification not found.")

        return {
            "id": notification.id,
            "is_read": notification.is_read,
        }
