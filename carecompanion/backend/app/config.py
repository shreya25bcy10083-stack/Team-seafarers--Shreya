"""
CareCompanion Backend Configuration.

Loads all environment variables using Pydantic Settings.
Never hardcode secrets — all values come from .env file.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "CareCompanion"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_PREFIX: str = "/api/v1"

    # Database (Neon PostgreSQL)
    DATABASE_URL: str

    # Authentication (JWT)
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440  # 24 hours

    # Google Gemini AI
    GEMINI_API_KEY: str

    # Cloudinary (File Storage)
    CLOUDINARY_URL: str

    # File Upload
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_EXTENSIONS: list[str] = ["pdf", "png", "jpg", "jpeg"]

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


@lru_cache()
def get_settings() -> Settings:
    """
    Return cached Settings instance.

    Uses lru_cache to avoid reading .env on every request.
    """
    return Settings()
