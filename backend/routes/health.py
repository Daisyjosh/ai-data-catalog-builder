"""Health Check Endpoint"""

from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "AI Data Catalog Builder API"
    }

@router.get("/health/ready")
async def readiness_check():
    """Readiness check endpoint"""
    return {
        "ready": True,
        "timestamp": datetime.utcnow().isoformat()
    }
