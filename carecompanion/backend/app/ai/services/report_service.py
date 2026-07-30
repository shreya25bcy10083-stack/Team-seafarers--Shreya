"""
AI Report Service — Extracts text from uploaded reports for AI analysis.
"""


def extract_text_from_url(report_url: str) -> str:
    """
    Extract text content from a report URL.

    For MVP, we pass the URL directly to Gemini which can handle
    image/PDF analysis. In the future, this can be enhanced with
    OCR or PDF parsing.
    """
    # For MVP: return URL as reference for Gemini to analyze
    # Gemini 2.5 Flash supports multimodal inputs including images
    return f"Report available at: {report_url}"


def extract_text_from_file(file_content: bytes, filename: str) -> str:
    """
    Extract text from a file's raw bytes.

    Basic implementation for MVP. Can be enhanced with:
    - PyPDF2 for PDF extraction
    - Tesseract for OCR
    - Image analysis via Gemini Vision
    """
    try:
        # Try to decode as text
        text = file_content.decode("utf-8")
        return text
    except (UnicodeDecodeError, AttributeError):
        # Binary file (PDF, image) — return filename as reference
        return f"Medical report file: {filename}. Please analyze this document."
