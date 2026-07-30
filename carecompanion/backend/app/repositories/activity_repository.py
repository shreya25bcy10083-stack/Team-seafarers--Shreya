"""
Activity Repository.

Database operations for activity_logs table.
Stores and retrieves chronological activity timeline items for patients.
"""

from sqlalchemy.orm import Session
from app.models.activity_log import ActivityLog


class ActivityRepository:
    """Database access for ActivityLog model."""

    def __init__(self, db: Session):
        self.db = db

    def create_log(self, patient_id: int, event_type: str, title: str, description: str | None = None) -> ActivityLog:
        """Create a new activity log entry."""
        log = ActivityLog(
            patient_id=patient_id,
            event_type=event_type,
            title=title,
            description=description,
        )
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log

    def get_patient_activity(self, patient_id: int, limit: int = 20) -> list[ActivityLog]:
        """Get recent activity logs for a patient, newest first."""
        return (
            self.db.query(ActivityLog)
            .filter(ActivityLog.patient_id == patient_id)
            .order_by(ActivityLog.created_at.desc())
            .limit(limit)
            .all()
        )
