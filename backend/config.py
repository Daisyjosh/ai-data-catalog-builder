"""Application Configuration"""

from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # App Settings
    DEBUG: bool = False
    APP_NAME: str = "AI Data Catalog Builder"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    
    # Database
    DATABASE_URL: str = "sqlite:///./backend/catalog.db"
    
    # Gemini API
    GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-2.5-flash"
    GEMINI_EMBEDDING_MODEL: str = "embedding-001"
    
    # File Storage
    UPLOAD_DIR: str = "./backend/uploads"
    MAX_UPLOAD_SIZE: int = 100 * 1024 * 1024  # 100MB
    ALLOWED_EXTENSIONS: list = ["csv", "json", "db", "sqlite"]
    
    # FAISS Vector Search
    FAISS_INDEX_PATH: str = "./backend/faiss_index.bin"
    FAISS_DIMENSION: int = 768  # Gemini embedding dimension
    
    # Agent Settings
    AGENT_BATCH_SIZE: int = 10
    AGENT_TIMEOUT: int = 300  # 5 minutes
    AGENT_MAX_RETRIES: int = 3
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 1000
    RATE_LIMIT_WINDOW: int = 3600  # 1 hour
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
