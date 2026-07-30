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
    Format a report analysis response into structured JSON.

    Extracts overall health status, summary, key findings, normal/abnormal observations, simplified explanation,
    lifestyle suggestions, questions for doctor, and disclaimer.
    """
    clean_text = raw_response.strip()
    if clean_text.startswith("```json"):
        clean_text = re.sub(r"^```json\s*", "", clean_text)
        clean_text = re.sub(r"\s*```$", "", clean_text)
    elif clean_text.startswith("```"):
        clean_text = re.sub(r"^```\s*", "", clean_text)
        clean_text = re.sub(r"\s*```$", "", clean_text)

    try:
        parsed = json.loads(clean_text)
        status = parsed.get("overall_health_status", "NEEDS_ATTENTION")
        label = parsed.get("health_status_label")
        if not label:
            label = "🟢 Good / Normal" if status == "HEALTHY" else "🟡 Needs Attention" if status == "NEEDS_ATTENTION" else "🔴 Urgent Care"

        return {
            "overall_health_status": status,
            "health_status_label": label,
            "summary": parsed.get("summary", raw_response),
            "key_findings": parsed.get("key_findings", ["Report analyzed by CareCompanion AI"]),
            "normal_observations": parsed.get("normal_observations", []),
            "abnormal_observations": parsed.get("abnormal_observations", []),
            "simplified_explanation": parsed.get("simplified_explanation", raw_response),
            "health_tips": parsed.get("lifestyle_suggestions") or parsed.get("health_tips", []),
            "questions_for_doctor": parsed.get("questions_for_doctor", []),
            "disclaimer": parsed.get(
                "disclaimer",
                "This information is educational and should not replace advice from a qualified healthcare professional."
            ),
        }
    except Exception:
        # Fallback line-by-line parsing if AI did not return valid JSON
        tips = []
        lines = raw_response.split("\n")
        for line in lines:
            stripped = line.strip()
            if stripped.startswith("- ") or stripped.startswith("• "):
                tips.append(stripped.lstrip("-•").strip())

        return {
            "overall_health_status": "NEEDS_ATTENTION",
            "health_status_label": "🟡 Needs Attention",
            "summary": raw_response[:300] + "...",
            "key_findings": tips[:3] if tips else ["Medical document successfully analyzed."],
            "normal_observations": ["Routine parameters evaluated."],
            "abnormal_observations": [],
            "simplified_explanation": raw_response,
            "health_tips": tips[3:6] if len(tips) > 3 else ["Maintain a balanced routine and stay hydrated."],
            "questions_for_doctor": ["What do these test results mean for my daily care plan?"],
            "disclaimer": "This information is educational and should not replace advice from a qualified healthcare professional.",
        }
