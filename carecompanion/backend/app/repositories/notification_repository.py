"""
Notification Repository.

Database operations for notifications table.
"""

from sqlalchemy.orm import Session
from app.models.notification import Notification


class NotificationRepository:
    """Database access for Notification model."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, patient_id: int, title: str, type: str, description: str | None = None) -> Notification:
        """Create a notification."""
        notification = Notification(
            patient_id=patient_id,
            title=title,
            description=description,
            type=type,
        )
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)
        return notification

    def get_by_patient_id(self, patient_id: int) -> list[Notification]:
        """Get all notifications for a patient, newest first."""
        return (
            self.db.query(Notification)
            .filter(Notification.patient_id == patient_id)
            .order_by(Notification.created_at.desc())
            .all()
        )

    def mark_as_read(self, notification_id: int) -> Notification | None:
        """Mark a notification as read."""
        notification = self.db.query(Notification).filter(Notification.id == notification_id).first()
        if notification:
            notification.is_read = True
            self.db.commit()
            self.db.refresh(notification)
        return notification
