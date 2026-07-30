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
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-flash-latest",
        "gemini-2.0-flash-lite",
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


def get_gemini_file_response(system_prompt: str, user_prompt: str, file_bytes: bytes, mime_type: str) -> str:
    """
    Send a prompt alongside a file payload (PDF or image) to Gemini.

    Args:
        system_prompt: System instructions.
        user_prompt: Text prompt instructions.
        file_bytes: Raw bytes of the uploaded PDF or image file.
        mime_type: File MIME type (e.g. application/pdf, image/png, image/jpeg).

    Returns:
        Generated text response.
    """
    models_to_try = [
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-flash-latest",
    ]

    file_part = {
        "mime_type": mime_type,
        "data": file_bytes,
    }

    for model_name in models_to_try:
        try:
            model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=system_prompt,
            )

            response = model.generate_content([user_prompt, file_part])

            if response and response.text:
                return response.text.strip()

        except Exception as e:
            continue

    # Fallback to text prompt if file part fails
    return get_gemini_response(system_prompt, user_prompt)
