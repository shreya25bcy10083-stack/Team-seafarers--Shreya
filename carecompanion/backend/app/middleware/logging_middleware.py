"""
Logging Middleware.

Logs request method, path, status code, and response time.
Never logs passwords, tokens, medical reports, or API keys.
"""

import time
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("carecompanion")


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log all incoming requests and response times."""

    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.time()

        # Log request (never log sensitive headers)
        logger.info(f"→ {request.method} {request.url.path}")

        response = await call_next(request)

        # Calculate response time
        duration = round((time.time() - start_time) * 1000, 2)
        logger.info(
            f"← {request.method} {request.url.path} "
            f"[{response.status_code}] {duration}ms"
        )

        return response
