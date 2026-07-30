"""
CareCompanion Backend Configuration.

Loads all environment variables using Pydantic Settings.
Never hardcode secrets — all values come from .env file.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache
<<<<<<< HEAD
from typing import List, Optional
import json
=======
>>>>>>> c1497f01e195e6bb99fda798bdf1d6e23bf18166


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "CareCompanion"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_PREFIX: str = "/api/v1"

    # Database (Neon PostgreSQL)
<<<<<<< HEAD
    DATABASE_URL: str = "postgresql+psycopg://user:password@localhost:5432/carecompanion"

    # Authentication (JWT)
    JWT_SECRET: str = "default_development_jwt_secret_key_32_chars_min"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440  # 24 hours
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Google Gemini AI
    GEMINI_API_KEY: str = "default_gemini_api_key"

    # Cloudinary (File Storage)
    CLOUDINARY_URL: Optional[str] = ""
    CLOUDINARY_CLOUD_NAME: Optional[str] = ""
    CLOUDINARY_API_KEY: Optional[str] = ""
    CLOUDINARY_API_SECRET: Optional[str] = ""
=======
    DATABASE_URL: str

    # Authentication (JWT)
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440  # 24 hours

    # Google Gemini AI
    GEMINI_API_KEY: str

    # Cloudinary (File Storage)
    CLOUDINARY_URL: str
>>>>>>> c1497f01e195e6bb99fda798bdf1d6e23bf18166

    # File Upload
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_EXTENSIONS: list[str] = ["pdf", "png", "jpg", "jpeg"]

<<<<<<< HEAD
    # CORS
    CORS_ORIGINS: str = '["http://localhost:3000","http://localhost:8081"]'

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from JSON string."""
        try:
            return json.loads(self.CORS_ORIGINS)
        except Exception:
            return ["*"]

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
=======
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
>>>>>>> c1497f01e195e6bb99fda798bdf1d6e23bf18166
    }


@lru_cache()
def get_settings() -> Settings:
    """
    Return cached Settings instance.

    Uses lru_cache to avoid reading .env on every request.
    """
    return Settings()
<<<<<<< HEAD


# Singleton settings instance
settings = get_settings()
=======
>>>>>>> c1497f01e195e6bb99fda798bdf1d6e23bf18166
