"""
Context Builder — Collects relevant user context for AI prompts.

Sources: User Role, Conversation, Wellness Data, Medication Info, Reports.
Keeps prompts concise by removing unnecessary information.
"""

from sqlalchemy.orm import Session
from typing import Optional

from app.repositories import patient_repository, user_repository
from app.repositories import medication_repository, wellness_repository


def build_chat_context(db: Session, user_id: int) -> dict:
    """
    Build context for a chat conversation.

    Returns dict with user info, medications, and recent wellness.
    """
    user = user_repository.get_user_by_id(db, user_id)
    patient = patient_repository.get_patient_by_user_id(db, user_id)

    context = {
        "user_role": user.role if user else "patient",
        "user_name": user.full_name if user else "User",
        "medications_context": "No medications recorded.",
        "wellness_context": "No recent wellness data.",
        "conversation_history": "No previous conversation.",
    }

    if patient:
        # Medication context
        meds = medication_repository.get_medications_by_patient(db, patient.id)
        if meds:
            med_lines = []
            for m in meds[:10]:  # Limit to avoid token bloat
                time_str = m.reminder_time.strftime("%H:%M") if m.reminder_time else "Not set"
                med_lines.append(
                    f"- {m.medicine_name} ({m.dosage or 'N/A'}) at {time_str}"
                )
            context["medications_context"] = "\n".join(med_lines)

        # Wellness context
        latest = wellness_repository.get_latest_wellness(db, patient.id)
        if latest:
            context["wellness_context"] = (
                f"- Mood: {latest.mood or 'N/A'}\n"
                f"- Sleep: {latest.sleep_hours or 'N/A'} hours\n"
                f"- Energy: {latest.energy_level or 'N/A'}\n"
                f"- Pain: {latest.pain_level or 'N/A'}/10\n"
                f"- Notes: {latest.notes or 'None'}"
            )

    return context


def build_report_context(db: Session, user_id: int) -> dict:
    """Build context for report analysis."""
    user = user_repository.get_user_by_id(db, user_id)
    patient = patient_repository.get_patient_by_user_id(db, user_id)

    return {
        "user_name": user.full_name if user else "User",
        "user_age": str(patient.age) if patient and patient.age else "Not specified",
        "blood_group": patient.blood_group if patient and patient.blood_group else "Not specified",
    }


def build_wellness_context(db: Session, user_id: int, checkin_data: dict) -> dict:
    """Build context for wellness guidance."""
    user = user_repository.get_user_by_id(db, user_id)

    return {
        "user_name": user.full_name if user else "User",
        "mood": checkin_data.get("mood", "N/A"),
        "sleep_hours": str(checkin_data.get("sleep_hours", "N/A")),
        "energy": checkin_data.get("energy", "N/A"),
        "pain_level": str(checkin_data.get("pain_level", "N/A")),
        "notes": checkin_data.get("notes", "None"),
    }
