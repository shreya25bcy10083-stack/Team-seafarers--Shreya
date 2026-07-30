"""
Wellness Router.

Endpoints: POST /wellness/checkin, GET /wellness/history
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_patient_or_caregiver
from app.schemas.wellness import WellnessCheckCreate
from app.services.wellness_service import WellnessService
from app.utils.response_builder import success_response

router = APIRouter(prefix="/wellness", tags=["Wellness"])


@router.post("/checkin")
def daily_checkin(
    request: WellnessCheckCreate,
    current_user: dict = Depends(require_patient_or_caregiver),
    db: Session = Depends(get_db),
):
    """Record a daily wellness check-in."""
    service = WellnessService(db)
    data = service.checkin(
        current_user,
        mood=request.mood,
        sleep_hours=request.sleep_hours,
        energy=request.energy,
        pain_level=request.pain_level,
        notes=request.notes,
    )
    return success_response(data=data, message="Wellness check-in recorded.")


@router.get("/history")
def get_wellness_history(
    current_user: dict = Depends(require_patient_or_caregiver),
    db: Session = Depends(get_db),
):
    """Get wellness check-in history."""
    service = WellnessService(db)
    data = service.get_history(current_user)
    return success_response(data=data)
