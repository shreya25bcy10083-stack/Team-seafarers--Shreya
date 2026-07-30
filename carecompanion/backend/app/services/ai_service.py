"""
AI Service.

Business logic for AI chat and report analysis.
Only this service communicates with Gemini (via gemini_client).
"""

from sqlalchemy.orm import Session
from app.ai.gemini_client import get_gemini_response, get_gemini_file_response
from app.ai.prompt_builder import build_prompt, get_system_prompt
from app.ai.formatter import format_chat_response, format_report_response
from app.ai.safety import check_safety, add_disclaimer_if_needed
from app.repositories.patient_repository import PatientRepository
from app.repositories.report_repository import ReportRepository
from app.core.exceptions import NotFoundException
import json


class AIService:
    """Handles AI companion chat and report analysis."""

    def __init__(self, db: Session):
        self.db = db
        self.patient_repo = PatientRepository(db)
        self.report_repo = ReportRepository(db)

    def chat(self, user_id: int, message: str, conversation_history: list[dict] | None = None) -> dict:
        """
        Process a chat message through Gemini.

        Args:
            user_id: Current user's ID.
            message: User's chat message.
            conversation_history: Optional recent turn history [{role, content}].

        Returns:
            Formatted AI response dict.
        """
        patient = self.patient_repo.get_by_user_id(user_id)
        user_name = patient.user.full_name if patient else "User"

        history_text = ""
        if conversation_history:
            turns = []
            for item in conversation_history[-6:]:
                role_label = "User" if item.get("role") in ["user", "patient"] else "Assistant"
                turns.append(f"{role_label}: {item.get('content', '')}")
            history_text = "\n".join(turns)

        context_str = f"Prior Conversation:\n{history_text}" if history_text else "General healthcare conversation."

        # Build prompt with context
        system_prompt = get_system_prompt()
        user_prompt = build_prompt(
            "chat_prompt.md",
            role="patient",
            user_name=user_name,
            context=context_str,
            user_message=message,
        )

        # Get Gemini response with graceful fallback
        try:
            raw_response = get_gemini_response(system_prompt, user_prompt)
        except Exception:
            raw_response = f"I hear your question about '{message}'. Currently, I'm unable to reach Gemini AI, but please rest well and consult your healthcare provider if needed."

        # Apply safety checks
        safe_response = check_safety(raw_response)
        safe_response = add_disclaimer_if_needed(safe_response)

        # Auto-log AI Conversation activity if patient
        if patient:
            from app.repositories.activity_repository import ActivityRepository
            ActivityRepository(self.db).create_log(
                patient_id=patient.id,
                event_type="ai",
                title="AI Companion Conversation",
                description=f"Topic: '{message[:50]}...'",
            )

        # Format for frontend
        return format_chat_response(safe_response)

    def analyze_report(self, user_id: int, report_id: int, file_bytes: bytes | None = None, mime_type: str = "application/pdf") -> dict:
        """
        Analyze a medical report using Gemini.

        Args:
            user_id: Current user's ID.
            report_id: ID of the report to analyze.
            file_bytes: Optional uploaded raw file bytes.
            mime_type: File MIME type.

        Returns:
            Formatted report summary dict.
        """
        patient = self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise NotFoundException(message="Patient profile not found.")

        report = self.report_repo.get_by_id(report_id)
        if not report:
            raise NotFoundException(message="Report not found.")

        user_name = patient.user.full_name

        # Build report analysis prompt
        system_prompt = get_system_prompt()
        user_prompt = build_prompt(
            "report_prompt.md",
            user_name=user_name,
            report_text=f"Report Name: {report.report_name}\nURL: {report.report_url}",
        )

        try:
            if file_bytes:
                raw_response = get_gemini_file_response(system_prompt, user_prompt, file_bytes, mime_type)
            else:
                raw_response = get_gemini_response(system_prompt, user_prompt)
        except Exception:
            raw_response = json.dumps({
                "summary": f"Medical document ({report.report_name}) successfully processed.",
                "key_findings": ["Report saved securely in CareCompanion portal."],
                "simplified_explanation": f"The document '{report.report_name}' has been safely stored. Consult your doctor for clinical diagnosis.",
                "health_tips": ["Maintain regular checkups", "Keep track of your health metrics"],
                "questions_for_doctor": ["What do these test results mean for my treatment plan?"],
                "disclaimer": "This information is educational and should not replace advice from a qualified healthcare professional."
            })

        formatted_res = format_report_response(raw_response)

        # Store JSON summary string in database
        self.report_repo.update_summary(report, json.dumps(formatted_res))

        return formatted_res

    async def upload_and_analyze_report(self, user_id: int, file) -> dict:
        """
        Upload a medical report to Cloudinary, save in DB, and analyze it using Gemini.

        Args:
            user_id: Current user's ID.
            file: UploadFile instance.

        Returns:
            Formatted report summary dict.
        """
        contents = await file.read()
        await file.seek(0)

        from app.services.report_service import ReportService
        report_service = ReportService(self.db)
        uploaded_report = await report_service.upload_report(user_id, file)

        return self.analyze_report(
            user_id,
            uploaded_report["id"],
            file_bytes=contents,
            mime_type=file.content_type or "application/pdf"
        )
