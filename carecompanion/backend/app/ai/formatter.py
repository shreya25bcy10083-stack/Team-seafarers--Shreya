"""
AI Response Formatter.

Cleans and structures Gemini output for frontend consumption.
"""

import json
import re


def format_chat_response(raw_response: str) -> dict:
    """
    Format a chat response into the standard AI output format.

    Returns:
        Dict with reply, tips, warning, disclaimer.
    """
    disclaimer = ""
    if any(keyword in raw_response.lower() for keyword in [
        "doctor", "healthcare", "medical", "consult", "professional"
    ]):
        disclaimer = (
            "This information is educational and should not replace "
            "advice from a qualified healthcare professional."
        )

    return {
        "reply": raw_response,
        "tips": [],
        "warning": "",
        "disclaimer": disclaimer,
    }


def format_report_response(raw_response: str) -> dict:
    """
    Format a report analysis response.

    Extracts summary and tips from the AI output.
    """
    # Try to extract tips as bullet points
    tips = []
    lines = raw_response.split("\n")
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("- ") or stripped.startswith("• "):
            tips.append(stripped.lstrip("-•").strip())

    # Limit tips to 5
    tips = tips[:5] if tips else []

    return {
        "summary": raw_response,
        "tips": tips,
        "warning": "",
        "disclaimer": (
            "This information is educational and should not replace "
            "advice from a qualified healthcare professional."
        ),
    }
