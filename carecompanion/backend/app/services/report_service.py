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


class ReportService:
    """Handles report upload, storage, and retrieval."""

    def __init__(self, db: Session):
        self.report_repo = ReportRepository(db)
        self.patient_repo = PatientRepository(db)

    async def upload_report(self, user_id: int, file: UploadFile) -> dict:
        """
        Upload a medical report to Cloudinary and store metadata.

        Returns:
            Report data with ID and URL.
        """
        patient = self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise NotFoundException(message="Patient profile not found.")

        # Upload to Cloudinary
        upload_result = await upload_to_cloudinary(file, folder="carecompanion/reports")

        # Store in database
        report = self.report_repo.create(
            patient_id=patient.id,
            report_name=file.filename or "Untitled Report",
            report_url=upload_result["url"],
        )

        return {
            "id": report.id,
            "report_name": report.report_name,
            "report_url": report.report_url,
            "ai_summary": report.ai_summary,
            "uploaded_at": report.uploaded_at.isoformat() if report.uploaded_at else None,
        }

    def get_reports(self, user_id: int) -> list[dict]:
        """Get all reports for the current patient."""
        patient = self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise NotFoundException(message="Patient profile not found.")

        reports = self.report_repo.get_by_patient_id(patient.id)
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

    def get_report_by_id(self, user_id: int, report_id: int) -> dict:
        """Get a single report by ID with ownership check."""
        patient = self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise NotFoundException(message="Patient profile not found.")

        report = self.report_repo.get_by_id(report_id)
        if not report:
            raise NotFoundException(message="Report not found.")
        if report.patient_id != patient.id:
            raise ForbiddenException(message="You do not own this report.")

        return {
            "id": report.id,
            "report_name": report.report_name,
            "report_url": report.report_url,
            "ai_summary": report.ai_summary,
            "uploaded_at": report.uploaded_at.isoformat() if report.uploaded_at else None,
        }
