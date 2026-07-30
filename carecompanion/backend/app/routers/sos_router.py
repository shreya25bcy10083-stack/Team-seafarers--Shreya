"""
SOS Router.

Endpoint: POST /sos
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_patient
from app.schemas.sos import SOSCreate
from app.services.sos_service import SOSService
from app.utils.response_builder import success_response

router = APIRouter(prefix="/sos", tags=["SOS Emergency"])


@router.post("")
def trigger_sos(
    request: SOSCreate,
    current_user: dict = Depends(require_patient),
    db: Session = Depends(get_db),
):
    """Trigger an SOS emergency alert."""
    service = SOSService(db)
    data = service.trigger_sos(
        current_user["user_id"],
        latitude=request.latitude,
        longitude=request.longitude,
    )
    return success_response(data=data, message="Emergency alert sent.")
