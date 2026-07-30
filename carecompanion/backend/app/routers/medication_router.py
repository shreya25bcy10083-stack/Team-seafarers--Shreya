"""
Medication Router.

Endpoints: GET/POST /medications, PUT/DELETE /medications/{id}, POST /medications/log
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_patient
from app.schemas.medication import MedicationCreate, MedicationUpdate, MedicationLogCreate
from app.services.medication_service import MedicationService
from app.utils.response_builder import success_response

router = APIRouter(prefix="/medications", tags=["Medications"])


@router.get("")
def get_medications(
    current_user: dict = Depends(require_patient),
    db: Session = Depends(get_db),
):
    """Get all medications for the current patient."""
    service = MedicationService(db)
    data = service.get_medications(current_user["user_id"])
    return success_response(data=data)


@router.post("")
def add_medication(
    request: MedicationCreate,
    current_user: dict = Depends(require_patient),
    db: Session = Depends(get_db),
):
    """Add a new medication."""
    service = MedicationService(db)
    data = service.add_medication(
        current_user["user_id"],
        name=request.name,
        dosage=request.dosage,
        frequency=request.frequency,
        time=request.time,
        instructions=request.instructions,
    )
    return success_response(data=data, message="Medication added.")


@router.put("/{medication_id}")
def update_medication(
    medication_id: int,
    request: MedicationUpdate,
    current_user: dict = Depends(require_patient),
    db: Session = Depends(get_db),
):
    """Update an existing medication."""
    service = MedicationService(db)
    data = service.update_medication(
        current_user["user_id"],
        medication_id,
        name=request.name,
        dosage=request.dosage,
        frequency=request.frequency,
        time=request.time,
        instructions=request.instructions,
    )
    return success_response(data=data, message="Medication updated.")


@router.delete("/{medication_id}")
def delete_medication(
    medication_id: int,
    current_user: dict = Depends(require_patient),
    db: Session = Depends(get_db),
):
    """Delete a medication."""
    service = MedicationService(db)
    service.delete_medication(current_user["user_id"], medication_id)
    return success_response(message="Medication deleted.")


@router.post("/log")
def log_medication(
    request: MedicationLogCreate,
    current_user: dict = Depends(require_patient),
    db: Session = Depends(get_db),
):
    """Log medication action (taken/missed/snoozed)."""
    service = MedicationService(db)
    data = service.log_medication(
        current_user["user_id"],
        request.medication_id,
        request.status,
    )
    return success_response(data=data, message=f"Medication marked as {request.status}.")
