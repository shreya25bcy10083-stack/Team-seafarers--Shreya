"""
Auth Middleware — JWT validation for protected endpoints.

Validates the Authorization Bearer token and injects user data
into the request state for downstream use.
"""

from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from app.utils.security import verify_token
from app.utils.response import error_response

# Endpoints that don't require authentication
PUBLIC_PATHS = [
    "/api/v1/auth/register",
    "/api/v1/auth/login",
    "/api/v1/health",
    "/docs",
    "/redoc",
    "/openapi.json",
]


class AuthMiddleware(BaseHTTPMiddleware):
    """
    Middleware that validates JWT tokens on protected endpoints.

    Public paths (register, login, health) are excluded.
    """

    async def dispatch(self, request: Request, call_next):
        # Skip authentication for public paths
        path = request.url.path
        if any(path.startswith(p) for p in PUBLIC_PATHS):
            return await call_next(request)

        # Skip OPTIONS requests (CORS preflight)
        if request.method == "OPTIONS":
            return await call_next(request)

        # Extract token
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content=error_response(message="Missing or invalid authorization token."),
            )

        token = auth_header.split("Bearer ")[1]
        payload = verify_token(token)

        if not payload:
            return JSONResponse(
                status_code=401,
                content=error_response(message="Invalid or expired token."),
            )

        # Inject user data into request state
        request.state.user_id = int(payload.get("sub", 0))
        request.state.user_role = payload.get("role", "")

        return await call_next(request)
