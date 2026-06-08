"""Dataset Model"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, func
from datetime import datetime
from backend.database.base import Base

class Dataset(Base):
    __tablename__ = "datasets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text)
    source_type = Column(String(20), nullable=False)  # CSV, JSON, SQLite
    file_path = Column(String(512), unique=True, nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    row_count = Column(Integer)
    metadata_generated = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<Dataset(id={self.id}, name={self.name})>"
