"""
Response Formatter — Converts raw Gemini output to frontend-friendly JSON.

Expected format: { reply, tips, warning, disclaimer }
"""

import json
import re


def format_response(raw_text: str) -> dict:
    """
    Parse Gemini response into the standard response format.

    Attempts JSON parsing first, then falls back to text extraction.
    """
    # Try to extract JSON from the response
    json_match = re.search(r'\{[\s\S]*\}', raw_text)

    if json_match:
        try:
            parsed = json.loads(json_match.group())
            return {
                "reply": parsed.get("reply", raw_text),
                "tips": parsed.get("tips", []),
                "warning": parsed.get("warning", ""),
                "disclaimer": parsed.get("disclaimer", ""),
            }
        except json.JSONDecodeError:
            pass

    # Fallback: use raw text as reply
    return {
        "reply": _clean_text(raw_text),
        "tips": [],
        "warning": "",
        "disclaimer": "",
    }


def _clean_text(text: str) -> str:
    """Clean formatting from raw AI response."""
    # Remove markdown code blocks
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*', '', text)
    # Remove excessive whitespace
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()
