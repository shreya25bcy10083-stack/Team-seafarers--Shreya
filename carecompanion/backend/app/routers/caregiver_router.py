"""
Caregiver Router.

Endpoints: POST /caregiver/join, GET /caregiver/dashboard, GET /caregiver/patient/{id}, GET/POST/PUT/DELETE /caregiver/medications
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_caregiver
from app.schemas.caregiver import CaregiverJoinRequest
from app.schemas.medication import MedicationCreate, MedicationUpdate
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


@router.get("/medications")
def get_patient_medications(
    patient_id: int | None = None,
    current_user: dict = Depends(require_caregiver),
    db: Session = Depends(get_db),
):
    """Caregiver retrieves medication schedule for linked patient."""
    service = CaregiverService(db)
    data = service.get_patient_medications(current_user["user_id"], patient_id=patient_id)
    return success_response(data=data)


@router.post("/medications")
def add_patient_medication(
    request: MedicationCreate,
    patient_id: int | None = None,
    current_user: dict = Depends(require_caregiver),
    db: Session = Depends(get_db),
):
    """Caregiver creates a medication schedule for linked patient."""
    service = CaregiverService(db)
    data = service.add_patient_medication(
        current_user["user_id"],
        patient_id=patient_id,
        name=request.name,
        dosage=request.dosage,
        frequency=request.frequency,
        time=request.time,
        instructions=request.instructions,
    )
    return success_response(data=data, message="Medication schedule created for patient.")


@router.put("/medications/{medication_id}")
def update_patient_medication(
    medication_id: int,
    request: MedicationUpdate,
    current_user: dict = Depends(require_caregiver),
    db: Session = Depends(get_db),
):
    """Caregiver updates a medication schedule."""
    service = CaregiverService(db)
    data = service.update_patient_medication(
        current_user["user_id"],
        medication_id=medication_id,
        name=request.name,
        dosage=request.dosage,
        frequency=request.frequency,
        time=request.time,
        instructions=request.instructions,
    )
    return success_response(data=data, message="Medication schedule updated.")


@router.delete("/medications/{medication_id}")
def delete_patient_medication(
    medication_id: int,
    current_user: dict = Depends(require_caregiver),
    db: Session = Depends(get_db),
):
    """Caregiver deletes a medication schedule."""
    service = CaregiverService(db)
    service.delete_patient_medication(current_user["user_id"], medication_id)
    return success_response(message="Medication schedule deleted.")


@router.get("/activity")
def get_patient_activity(
    current_user: dict = Depends(require_caregiver),
    db: Session = Depends(get_db),
):
    """Get recent activity timeline feed for caregiver dashboard."""
    service = CaregiverService(db)
    data = service.get_patient_activity(current_user["user_id"])
    return success_response(data=data)


@router.get("/wellness")
def get_patient_wellness(
    current_user: dict = Depends(require_caregiver),
    db: Session = Depends(get_db),
):
    """Get wellness history for linked patient."""
    service = CaregiverService(db)
    data = service.get_patient_wellness(current_user["user_id"])
    return success_response(data=data)
