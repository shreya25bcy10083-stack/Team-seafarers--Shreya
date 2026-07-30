"""
AI Router.

Endpoints: POST /ai/chat, POST /ai/report-summary
"""

from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_patient
from app.schemas.ai import ChatRequest
from app.services.ai_service import AIService
from app.utils.response_builder import success_response

router = APIRouter(prefix="/ai", tags=["AI Companion"])


@router.post("/chat")
def chat(
    request: ChatRequest,
    current_user: dict = Depends(require_patient),
    db: Session = Depends(get_db),
):
    """Chat with the AI Companion."""
    service = AIService(db)
    data = service.chat(current_user["user_id"], request.message)
    return success_response(data=data)


@router.post("/report-summary")
async def report_summary(
    file: UploadFile = File(...),
    current_user: dict = Depends(require_patient),
    db: Session = Depends(get_db),
):
    """Upload a report and get an AI-generated summary."""
    service = AIService(db)
    data = await service.upload_and_analyze_report(current_user["user_id"], file)
    return success_response(data=data)
