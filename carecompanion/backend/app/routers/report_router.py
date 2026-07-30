"""
Report Router.

Endpoints: POST /reports/upload, GET /reports, GET /reports/{id}
"""

from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_patient
from app.services.report_service import ReportService
from app.utils.response_builder import success_response

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post("/upload")
async def upload_report(
    file: UploadFile = File(...),
    current_user: dict = Depends(require_patient),
    db: Session = Depends(get_db),
):
    """Upload a medical report (PDF, PNG, JPG, JPEG). Max 10 MB."""
    service = ReportService(db)
    data = await service.upload_report(current_user["user_id"], file)
    return success_response(data=data, message="Report uploaded successfully.")


@router.get("")
def get_reports(
    current_user: dict = Depends(require_patient),
    db: Session = Depends(get_db),
):
    """Get all reports for the current patient."""
    service = ReportService(db)
    data = service.get_reports(current_user["user_id"])
    return success_response(data=data)


@router.get("/{report_id}")
def get_report(
    report_id: int,
    current_user: dict = Depends(require_patient),
    db: Session = Depends(get_db),
):
    """Get a single report by ID."""
    service = ReportService(db)
    data = service.get_report_by_id(current_user["user_id"], report_id)
    return success_response(data=data)
