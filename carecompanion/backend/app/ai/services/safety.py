"""
Safety Layer — Ensures AI responses follow project safety rules.

Prevents diagnosis, prescriptions, and adds medical disclaimers.
"""

import re

# Keywords that indicate unsafe AI behaviour
UNSAFE_PATTERNS = [
    r"\byou have\b.*\b(disease|condition|disorder|syndrome|cancer)\b",
    r"\byou are suffering from\b",
    r"\bi diagnose\b",
    r"\btake (\d+)\s*(mg|ml|tablets?|pills?|capsules?)\b",
    r"\bstop taking\b.*\bmedication\b",
    r"\bincrease.*dose\b",
    r"\bdecrease.*dose\b",
    r"\bchange.*dosage\b",
]

DISCLAIMER = (
    "This information is educational and should not replace advice "
    "from a qualified healthcare professional."
)


def check_safety(response_text: str) -> str:
    """
    Check AI response for unsafe content and sanitize if needed.

    Returns sanitized response text.
    """
    lower_text = response_text.lower()

    for pattern in UNSAFE_PATTERNS:
        if re.search(pattern, lower_text):
            # Replace the unsafe response with a safe fallback
            return (
                "I appreciate your question, but I'm not able to provide specific "
                "medical advice on that topic. I'd recommend speaking with your "
                "healthcare provider for personalized guidance. "
                f"\n\n{DISCLAIMER}"
            )

    return response_text


def ensure_disclaimer(response_dict: dict) -> dict:
    """
    Ensure the response includes a disclaimer when health topics are discussed.
    """
    if not response_dict.get("disclaimer"):
        # Check if the reply discusses health topics
        reply = response_dict.get("reply", "").lower()
        health_keywords = [
            "health", "medical", "medicine", "medication", "symptom",
            "report", "blood", "pain", "doctor", "hospital", "treatment",
            "diet", "exercise", "sleep", "wellness",
        ]
        if any(kw in reply for kw in health_keywords):
            response_dict["disclaimer"] = DISCLAIMER

    return response_dict
