"""Global Error Handler Middleware"""

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def setup_error_handlers(app: FastAPI):
    """Setup global error handlers"""
    
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception: {str(exc)}", exc_info=exc)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": 500,
                "error": "Internal Server Error",
                "timestamp": datetime.utcnow().isoformat(),
                "request_id": request.headers.get("X-Request-ID", "unknown")
            }
        )
