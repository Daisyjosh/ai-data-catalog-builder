"""Table Model"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, func
from datetime import datetime
from backend.database.base import Base

class Table(Base):
    __tablename__ = "tables"
    
    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    row_count = Column(Integer, nullable=False)
    description = Column(Text)
    metadata_generated = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        ('dataset_id', 'name'),  # Unique constraint on dataset_id and name
    )
    
    def __repr__(self):
        return f"<Table(id={self.id}, name={self.name})>"
