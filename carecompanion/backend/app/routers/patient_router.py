"""
Patient Router.

Endpoints: GET /patient/profile, PUT /patient/profile, POST /patient/invite
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_patient
from app.schemas.patient import PatientUpdate
from app.services.patient_service import PatientService
from app.utils.response_builder import success_response

router = APIRouter(prefix="/patient", tags=["Patient"])


@router.get("/profile")
def get_profile(
    current_user: dict = Depends(require_patient),
    db: Session = Depends(get_db),
):
    """Get the current patient's profile."""
    service = PatientService(db)
    data = service.get_profile(current_user["user_id"])
    return success_response(data=data)


@router.put("/profile")
def update_profile(
    request: PatientUpdate,
    current_user: dict = Depends(require_patient),
    db: Session = Depends(get_db),
):
    """Update the current patient's profile."""
    service = PatientService(db)
    data = service.update_profile(
        current_user["user_id"],
        age=request.age,
        gender=request.gender,
        blood_group=request.blood_group,
        emergency_contact=request.emergency_contact,
    )
    return success_response(data=data, message="Profile updated.")


@router.post("/invite")
def generate_invite_code(
    current_user: dict = Depends(require_patient),
    db: Session = Depends(get_db),
):
    """Generate an invite code for caregiver linking."""
    service = PatientService(db)
    code = service.generate_invite_code(current_user["user_id"])
    return success_response(data={"invite_code": code})


@router.post("/link")
def link_caregiver(
    current_user: dict = Depends(require_patient),
    db: Session = Depends(get_db),
):
    """Generate or retrieve patient invite code for caregiver linking."""
    service = PatientService(db)
    code = service.generate_invite_code(current_user["user_id"])
    return success_response(data={"invite_code": code}, message="Invite code generated for caregiver linking.")
