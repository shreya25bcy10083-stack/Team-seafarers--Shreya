"""
CareCompanion Backend — Main Application.

FastAPI app creation, router registration, middleware setup, and startup events.
Entry point: uvicorn app.main:app --reload
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import engine, Base
from app.core.exceptions import (
    CareCompanionException,
    carecompanion_exception_handler,
    generic_exception_handler,
)
from app.middleware.logging_middleware import LoggingMiddleware
from app.utils.response_builder import success_response

# Import all models so Base.metadata knows about them
from app.models import (  # noqa: F401
    User, Patient, Caregiver, PatientCaregiver,
    Medication, MedicationLog, WellnessCheck,
    MedicalReport, Notification, SOSEvent,
)

# Import routers
from app.routers import (
    auth_router,
    patient_router,
    caregiver_router,
    medication_router,
    wellness_router,
    report_router,
    ai_router,
    notification_router,
    sos_router,
)

settings = get_settings()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("carecompanion")

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered healthcare companion for elderly users.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Logging Middleware
app.add_middleware(LoggingMiddleware)

# Exception Handlers
app.add_exception_handler(CareCompanionException, carecompanion_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Register Routers under /api/v1
API_PREFIX = settings.API_PREFIX

from app.routers import health_router

app.include_router(health_router.router, prefix=API_PREFIX)
app.include_router(auth_router.router, prefix=API_PREFIX)
app.include_router(patient_router.router, prefix=API_PREFIX)
app.include_router(caregiver_router.router, prefix=API_PREFIX)
app.include_router(medication_router.router, prefix=API_PREFIX)
app.include_router(wellness_router.router, prefix=API_PREFIX)
app.include_router(report_router.router, prefix=API_PREFIX)
app.include_router(ai_router.router, prefix=API_PREFIX)
app.include_router(notification_router.router, prefix=API_PREFIX)
app.include_router(sos_router.router, prefix=API_PREFIX)


@app.on_event("startup")
def on_startup():
    """Create database tables on startup."""
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully.")
    logger.info(f"{settings.APP_NAME} v{settings.APP_VERSION} started.")


@app.get(f"{API_PREFIX}/health", tags=["Health"])
def health_check():
    """Server health check endpoint."""
    return {"status": "online"}


@app.get("/", tags=["Root"])
def root():
    """Root endpoint."""
    return success_response(
        message=f"{settings.APP_NAME} API v{settings.APP_VERSION} is running."
    )
