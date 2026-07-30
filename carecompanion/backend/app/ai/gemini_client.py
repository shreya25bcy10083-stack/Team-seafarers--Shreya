"""
Gemini Client.

Handles communication with Google Gemini API with fallback for rate limits.
Only this module communicates with Gemini directly.
"""

import google.generativeai as genai
from app.config import get_settings
from app.core.exceptions import AIServiceException

settings = get_settings()

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)


def get_gemini_response(system_prompt: str, user_prompt: str) -> str:
    """
    Send a prompt to Gemini and return the response text.

    Args:
        system_prompt: System-level instructions.
        user_prompt: User-facing prompt with context.

    Returns:
        Generated text response.

    Raises:
        AIServiceException: If Gemini fails.
    """
    models_to_try = [
        "gemini-flash-latest",
        "gemini-2.0-flash-lite",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
    ]

    for model_name in models_to_try:
        try:
            model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=system_prompt,
            )

            response = model.generate_content(user_prompt)

            if response and response.text:
                return response.text.strip()

        except Exception as e:
            # Try next active model on rate limit / quota exceptions
            continue

    raise AIServiceException(
        message="I'm unable to answer that right now. Please try again in a few moments."
    )
