"""
AI Service.

Business logic for AI chat and report analysis.
Only this service communicates with Gemini (via gemini_client).
"""

from sqlalchemy.orm import Session
from app.ai.gemini_client import get_gemini_response
from app.ai.prompt_builder import build_prompt, get_system_prompt
from app.ai.formatter import format_chat_response, format_report_response
from app.ai.safety import check_safety, add_disclaimer_if_needed
from app.repositories.patient_repository import PatientRepository
from app.repositories.report_repository import ReportRepository
from app.core.exceptions import NotFoundException


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

        # Get Gemini response
        raw_response = get_gemini_response(system_prompt, user_prompt)

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

    def analyze_report(self, user_id: int, report_id: int) -> dict:
        """
        Analyze a medical report using Gemini.

        Args:
            user_id: Current user's ID.
            report_id: ID of the report to analyze.

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
            report_text=f"Report: {report.report_name}\nURL: {report.report_url}",
        )

        # Get Gemini response
        raw_response = get_gemini_response(system_prompt, user_prompt)

        # Apply safety
        safe_response = check_safety(raw_response)
        safe_response = add_disclaimer_if_needed(safe_response)

        # Store summary in database
        self.report_repo.update_summary(report, safe_response)

        # Format for frontend
        return format_report_response(safe_response)

    async def upload_and_analyze_report(self, user_id: int, file) -> dict:
        """
        Upload a medical report and analyze it using Gemini.

        Args:
            user_id: Current user's ID.
            file: UploadFile instance.

        Returns:
            Formatted report summary dict.
        """
        from app.services.report_service import ReportService
        report_service = ReportService(self.db)
        uploaded_report = await report_service.upload_report(user_id, file)

        return self.analyze_report(user_id, uploaded_report["id"])

