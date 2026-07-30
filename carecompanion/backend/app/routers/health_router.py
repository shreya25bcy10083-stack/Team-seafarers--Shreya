"""
Health Router — Server health check endpoint.

GET /health — No authentication required.
"""

from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    """Server health check. Returns { status: 'online' }."""
    return {"status": "online"}
