"""
Caregiver Router.

Endpoints: POST /caregiver/join, GET /caregiver/dashboard, GET /caregiver/patient/{id}
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_caregiver
from app.schemas.caregiver import CaregiverJoinRequest
from app.services.caregiver_service import CaregiverService
from app.utils.response_builder import success_response

router = APIRouter(prefix="/caregiver", tags=["Caregiver"])


@router.post("/join")
def join_patient(
    request: CaregiverJoinRequest,
    current_user: dict = Depends(require_caregiver),
    db: Session = Depends(get_db),
):
    """Link caregiver to a patient using an invite code."""
    service = CaregiverService(db)
    result = service.join_patient(current_user["user_id"], request.invite_code)
    return success_response(message=result["message"])


@router.get("/dashboard")
def get_dashboard(
    current_user: dict = Depends(require_caregiver),
    db: Session = Depends(get_db),
):
    """Get the caregiver dashboard with patient summary."""
    service = CaregiverService(db)
    data = service.get_dashboard(current_user["user_id"])
    return success_response(data=data)


@router.get("/patient/{patient_id}")
def get_patient_details(
    patient_id: int,
    current_user: dict = Depends(require_caregiver),
    db: Session = Depends(get_db),
):
    """Get detailed patient information."""
    service = CaregiverService(db)
    data = service.get_patient_details(current_user["user_id"], patient_id)
    return success_response(data=data)
