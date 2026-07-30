"""
Gemini Client — Communicates with Google Gemini AI.

Handles: send prompt, receive response, retries, API failures.
Never accessed directly from frontend.
"""

import google.generativeai as genai
from app.config import settings
from app.core.exceptions import AppException

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)

# Default model
MODEL_NAME = "gemini-2.5-flash"


def generate_response(system_prompt: str, user_prompt: str, max_retries: int = 2) -> str:
    """
    Send a prompt to Gemini and return the response text.

    Args:
        system_prompt: The system instruction for the model.
        user_prompt: The combined context + user message.
        max_retries: Number of retry attempts on failure.

    Returns:
        Raw response text from Gemini.
    """
    model = genai.GenerativeModel(
        model_name=MODEL_NAME,
        system_instruction=system_prompt,
    )

    for attempt in range(max_retries + 1):
        try:
            response = model.generate_content(user_prompt)
            if response and response.text:
                return response.text
            raise AppException("Empty response from AI.")
        except AppException:
            raise
        except Exception as e:
            if attempt < max_retries:
                continue
            # Fallback after all retries
            raise AppException(
                "I'm unable to answer that right now. Please try again in a few moments."
            )

    raise AppException("AI service unavailable.")
