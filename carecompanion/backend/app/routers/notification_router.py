"""
Notification Router.

Endpoints: GET /notifications, PUT /notifications/{id}
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.services.notification_service import NotificationService
from app.utils.response_builder import success_response

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("")
def get_notifications(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all notifications for the current user."""
    service = NotificationService(db)
    data = service.get_notifications(current_user)
    return success_response(data=data)


@router.put("/{notification_id}")
def mark_as_read(
    notification_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a notification as read."""
    service = NotificationService(db)
    data = service.mark_as_read(notification_id)
    return success_response(data=data, message="Notification marked as read.")


@router.post("/send")
def send_notification(
    patient_id: int,
    title: str,
    type: str,
    description: str | None = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send a manual or high-priority system notification."""
    from app.repositories.notification_repository import NotificationRepository
    repo = NotificationRepository(db)
    notification = repo.create(patient_id=patient_id, title=title, type=type, description=description)

    return success_response(
        data={
            "id": notification.id,
            "title": notification.title,
            "type": notification.type,
        },
        message="Notification sent successfully.",
    )
