"""
Notification Service.

Business logic for notifications.
"""

from sqlalchemy.orm import Session
from app.repositories.notification_repository import NotificationRepository
from app.repositories.patient_repository import PatientRepository
from app.core.exceptions import NotFoundException


from app.utils.patient_resolver import resolve_patient_id


class NotificationService:
    """Handles notification creation and retrieval."""

    def __init__(self, db: Session):
        self.db = db
        self.notification_repo = NotificationRepository(db)
        self.patient_repo = PatientRepository(db)

    def get_notifications(self, current_user: dict | int) -> list[dict]:
        """Get all notifications for the patient or caregiver's linked patient."""
        patient_id = resolve_patient_id(self.db, current_user)
        notifications = self.notification_repo.get_by_patient_id(patient_id)
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
