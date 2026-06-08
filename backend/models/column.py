"""Column Model"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from datetime import datetime
from backend.database.base import Base

class Column(Base):
    __tablename__ = "columns"
    
    id = Column(Integer, primary_key=True, index=True)
    table_id = Column(Integer, ForeignKey("tables.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    data_type = Column(String(50), nullable=False)  # String, Integer, Float, Boolean, Date, DateTime, JSON, Unknown
    nullable = Column(Boolean, default=True)
    sample_values = Column(Text)  # JSON array
    metadata_generated = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<Column(id={self.id}, name={self.name}, data_type={self.data_type})>"
