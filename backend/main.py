"""FastAPI Application Entry Point"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZIPMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

from backend.config import settings
from backend.database.base import engine, Base
from backend.routes import datasets, tables, columns, metadata, search, agent, dashboard, health
from backend.mcp.server import mcp_router
from backend.middleware.error_handler import setup_error_handlers
from backend.middleware.logging import LoggingMiddleware

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting AI Data Catalog Builder")
    yield
    # Shutdown
    logger.info("Shutting down AI Data Catalog Builder")

app = FastAPI(
    title="AI Data Catalog Builder API",
    description="REST API for AI-powered dataset cataloging with agent-based metadata generation",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Compression Middleware
app.add_middleware(GZIPMiddleware, minimum_size=1000)

# Custom Middleware
app.add_middleware(LoggingMiddleware)

# Setup error handlers
setup_error_handlers(app)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(datasets.router, prefix="/api/datasets", tags=["Datasets"])
app.include_router(tables.router, prefix="/api/tables", tags=["Tables"])
app.include_router(columns.router, prefix="/api/columns", tags=["Columns"])
app.include_router(metadata.router, prefix="/api/metadata", tags=["Metadata"])
app.include_router(search.router, prefix="/api/search", tags=["Search"])
app.include_router(agent.router, prefix="/api/agent", tags=["Agent"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(mcp_router, prefix="/api/mcp", tags=["MCP"])

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "AI Data Catalog Builder API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )
