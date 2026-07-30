"""
AI Safety Layer.

Filters unsafe medical advice from AI responses.
Ensures AI never diagnoses, prescribes, or provides emergency advice.
"""

UNSAFE_PATTERNS = [
    "you have",
    "you are diagnosed",
    "take this medication",
    "stop taking",
    "increase your dosage",
    "decrease your dosage",
    "you should take",
    "i prescribe",
    "i diagnose",
    "you definitely have",
    "this is certainly",
]

DISCLAIMER = (
    "This information is educational and should not replace "
    "advice from a qualified healthcare professional."
)


def check_safety(response: str) -> str:
    """
    Check AI response for unsafe medical advice.

    If unsafe patterns are detected, appends a strong disclaimer.

    Args:
        response: Raw AI response text.

    Returns:
        Sanitized response text.
    """
    response_lower = response.lower()

    for pattern in UNSAFE_PATTERNS:
        if pattern in response_lower:
            # Don't remove the content, but add a strong disclaimer
            response += (
                f"\n\n⚠️ Important: {DISCLAIMER} "
                "Please consult your doctor before making any changes to your healthcare routine."
            )
            break

    return response


def add_disclaimer_if_needed(response: str) -> str:
    """Add a disclaimer if the response discusses health topics."""
    health_keywords = [
        "medicine", "medication", "health", "symptom", "treatment",
        "blood", "pressure", "sugar", "cholesterol", "pain",
        "report", "diagnosis", "condition",
    ]

    response_lower = response.lower()
    if any(keyword in response_lower for keyword in health_keywords):
        if DISCLAIMER not in response:
            response += f"\n\n{DISCLAIMER}"

    return response
