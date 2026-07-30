"""
AI Service — Orchestrates Context → Prompt → Gemini → Safety → Format.

This is the main entry point for all AI operations.
"""

from sqlalchemy.orm import Session

from app.ai.services.context_builder import build_chat_context, build_report_context, build_wellness_context
from app.ai.services.prompt_builder import (
    build_system_prompt,
    build_chat_prompt,
    build_report_prompt,
    build_wellness_prompt,
    build_medication_prompt,
)
from app.ai.services.gemini_client import generate_response
from app.ai.services.safety import check_safety, ensure_disclaimer
from app.ai.services.formatter import format_response
from app.core.exceptions import AppException


FALLBACK_RESPONSE = {
    "reply": "I'm unable to answer that right now. Please try again in a few moments.",
    "tips": [],
    "warning": "",
    "disclaimer": "",
}


def chat(db: Session, user_id: int, message: str) -> dict:
    """
    Process a chat message through the full AI pipeline.

    Flow: Context → Prompt → Gemini → Safety → Format
    """
    try:
        # 1. Build context
        context = build_chat_context(db, user_id)

        # 2. Build prompts
        system_prompt = build_system_prompt()
        user_prompt = build_chat_prompt(context, message)

        # 3. Call Gemini
        raw_response = generate_response(system_prompt, user_prompt)

        # 4. Safety check
        safe_response = check_safety(raw_response)

        # 5. Format response
        formatted = format_response(safe_response)

        # 6. Ensure disclaimer
        formatted = ensure_disclaimer(formatted)

        return formatted

    except AppException:
        raise
    except Exception:
        return FALLBACK_RESPONSE


def analyze_report(db: Session, user_id: int, report_text: str) -> dict:
    """
    Analyze a medical report through the AI pipeline.

    Flow: Context → Report Prompt → Gemini → Safety → Format
    """
    try:
        # 1. Build context
        context = build_report_context(db, user_id)

        # 2. Build prompts
        system_prompt = build_system_prompt()
        user_prompt = build_report_prompt(context, report_text)

        # 3. Call Gemini
        raw_response = generate_response(system_prompt, user_prompt)

        # 4. Safety check
        safe_response = check_safety(raw_response)

        # 5. Format response
        formatted = format_response(safe_response)

        # 6. Ensure disclaimer
        formatted = ensure_disclaimer(formatted)

        return formatted

    except AppException:
        raise
    except Exception:
        return FALLBACK_RESPONSE


def wellness_guidance(db: Session, user_id: int, checkin_data: dict) -> dict:
    """
    Generate wellness guidance based on check-in data.

    Flow: Context → Wellness Prompt → Gemini → Safety → Format
    """
    try:
        # 1. Build context
        context = build_wellness_context(db, user_id, checkin_data)

        # 2. Build prompts
        system_prompt = build_system_prompt()
        user_prompt = build_wellness_prompt(context)

        # 3. Call Gemini
        raw_response = generate_response(system_prompt, user_prompt)

        # 4. Safety check
        safe_response = check_safety(raw_response)

        # 5. Format
        formatted = format_response(safe_response)
        formatted = ensure_disclaimer(formatted)

        return formatted

    except AppException:
        raise
    except Exception:
        return FALLBACK_RESPONSE
