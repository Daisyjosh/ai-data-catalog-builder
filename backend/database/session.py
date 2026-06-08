"""Database Session Management"""

from sqlalchemy.orm import Session
from backend.database.base import SessionLocal

def get_db_session() -> Session:
    """Get a new database session"""
    return SessionLocal()
