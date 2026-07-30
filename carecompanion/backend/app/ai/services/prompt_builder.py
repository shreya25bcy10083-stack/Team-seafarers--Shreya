"""
Prompt Builder — Loads templates and injects context.

Prompt templates are NEVER hardcoded. Each template has one responsibility.
"""

import os
from pathlib import Path

# Base path for prompt templates
PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


def load_template(template_name: str) -> str:
    """Load a prompt template file by name."""
    template_path = PROMPTS_DIR / template_name
    if not template_path.exists():
        raise FileNotFoundError(f"Prompt template not found: {template_name}")
    return template_path.read_text(encoding="utf-8")


def build_system_prompt() -> str:
    """Load the system prompt (personality, rules, safety, output style)."""
    return load_template("system_prompt.md")


def build_chat_prompt(context: dict, user_message: str) -> str:
    """
    Build a chat prompt by injecting context into the chat template.

    Args:
        context: Dict from context_builder with user info, meds, wellness.
        user_message: The user's actual message.
    """
    template = load_template("chat_prompt.md")
    return template.format(
        user_role=context.get("user_role", "patient"),
        user_name=context.get("user_name", "User"),
        medications_context=context.get("medications_context", "None"),
        wellness_context=context.get("wellness_context", "None"),
        conversation_history=context.get("conversation_history", "None"),
        user_message=user_message,
    )


def build_report_prompt(context: dict, report_text: str) -> str:
    """Build a report analysis prompt."""
    template = load_template("report_prompt.md")
    return template.format(
        report_text=report_text,
        user_name=context.get("user_name", "User"),
        user_age=context.get("user_age", "Not specified"),
        blood_group=context.get("blood_group", "Not specified"),
    )


def build_wellness_prompt(context: dict) -> str:
    """Build a wellness guidance prompt."""
    template = load_template("wellness_prompt.md")
    return template.format(
        user_name=context.get("user_name", "User"),
        mood=context.get("mood", "N/A"),
        sleep_hours=context.get("sleep_hours", "N/A"),
        energy=context.get("energy", "N/A"),
        pain_level=context.get("pain_level", "N/A"),
        notes=context.get("notes", "None"),
    )


def build_medication_prompt(context: dict, user_message: str) -> str:
    """Build a medication explanation prompt."""
    template = load_template("medication_prompt.md")
    return template.format(
        medication_context=context.get("medications_context", "No medication data."),
        user_message=user_message,
    )
