"""
Report Service.

Business logic for medical report upload and retrieval.
"""

from sqlalchemy.orm import Session
from fastapi import UploadFile
from app.repositories.report_repository import ReportRepository
from app.repositories.patient_repository import PatientRepository
from app.utils.file_helpers import upload_to_cloudinary
from app.core.exceptions import NotFoundException, ForbiddenException


from app.repositories.activity_repository import ActivityRepository


from app.utils.patient_resolver import resolve_patient_id


class ReportService:
    """Handles report upload, storage, and retrieval."""

    def __init__(self, db: Session):
        self.db = db
        self.report_repo = ReportRepository(db)
        self.patient_repo = PatientRepository(db)
        self.activity_repo = ActivityRepository(db)

    async def upload_report(self, current_user: dict, file: UploadFile) -> dict:
        """
        Upload a medical report to Cloudinary/local storage and store metadata.
        """
        patient_id = resolve_patient_id(self.db, current_user)

        # Upload to Cloudinary / local fallback
        upload_result = await upload_to_cloudinary(file, folder="carecompanion/reports")

        # Store in database
        report = self.report_repo.create(
            patient_id=patient_id,
            report_name=file.filename or "Untitled Report",
            report_url=upload_result["url"],
        )

        actor = "Caregiver" if isinstance(current_user, dict) and current_user.get("role") == "caregiver" else "Patient"
        self.activity_repo.create_log(
            patient_id=patient_id,
            event_type="report",
            title=f"Medical Report Uploaded by {actor}: {report.report_name}",
            description="Report ready for viewing and AI analysis.",
        )

        return {
            "id": report.id,
            "report_name": report.report_name,
            "report_url": report.report_url,
            "ai_summary": report.ai_summary,
            "uploaded_at": report.uploaded_at.isoformat() if report.uploaded_at else None,
        }

    def get_reports(self, current_user: dict) -> list[dict]:
        """Get all reports for the current patient or caregiver's linked patient."""
        patient_id = resolve_patient_id(self.db, current_user)

        reports = self.report_repo.get_by_patient_id(patient_id)
        return [
            {
                "id": r.id,
                "report_name": r.report_name,
                "report_url": r.report_url,
                "ai_summary": r.ai_summary,
                "uploaded_at": r.uploaded_at.isoformat() if r.uploaded_at else None,
            }
            for r in reports
        ]

    def get_report_by_id(self, current_user: dict, report_id: int) -> dict:
        """Get a single report by ID with ownership/link check."""
        patient_id = resolve_patient_id(self.db, current_user)

        report = self.report_repo.get_by_id(report_id)
        if not report:
            raise NotFoundException(message="Report not found.")
        if report.patient_id != patient_id:
            raise ForbiddenException(message="You do not have access to this report.")

        return {
            "id": report.id,
            "report_name": report.report_name,
            "report_url": report.report_url,
            "ai_summary": report.ai_summary,
            "uploaded_at": report.uploaded_at.isoformat() if report.uploaded_at else None,
        }
