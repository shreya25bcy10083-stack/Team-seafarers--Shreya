"""
Report Repository.

Database operations for medical_reports table.
"""

from sqlalchemy.orm import Session
from app.models.medical_report import MedicalReport


class ReportRepository:
    """Database access for MedicalReport model."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, patient_id: int, report_name: str, report_url: str, ai_summary: str | None = None) -> MedicalReport:
        """Create a new medical report record."""
        report = MedicalReport(
            patient_id=patient_id,
            report_name=report_name,
            report_url=report_url,
            ai_summary=ai_summary,
        )
        self.db.add(report)
        self.db.commit()
        self.db.refresh(report)
        return report

    def get_by_patient_id(self, patient_id: int) -> list[MedicalReport]:
        """Get all reports for a patient, newest first."""
        return (
            self.db.query(MedicalReport)
            .filter(MedicalReport.patient_id == patient_id)
            .order_by(MedicalReport.uploaded_at.desc())
            .all()
        )

    def get_by_id(self, report_id: int) -> MedicalReport | None:
        """Get a report by ID."""
        return self.db.query(MedicalReport).filter(MedicalReport.id == report_id).first()

    def update_summary(self, report: MedicalReport, ai_summary: str) -> MedicalReport:
        """Update the AI summary for a report."""
        report.ai_summary = ai_summary
        self.db.commit()
        self.db.refresh(report)
        return report
