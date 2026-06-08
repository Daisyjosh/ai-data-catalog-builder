"""Metadata Model"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, LargeBinary
from datetime import datetime
from backend.database.base import Base

class Metadata(Base):
    __tablename__ = "metadata"
    
    id = Column(Integer, primary_key=True, index=True)
    column_id = Column(Integer, ForeignKey("columns.id", ondelete="CASCADE"), nullable=False, unique=True)
    business_description = Column(Text, nullable=False)
    business_category = Column(String(100))
    tags = Column(Text)  # JSON array
    sensitivity_level = Column(String(20), default="Internal")  # Public, Internal, Confidential
    embedding = Column(LargeBinary)  # Binary serialized vector
    embedding_model = Column(String(50), default="gemini-embedding-001")
    generated_at = Column(DateTime, default=datetime.utcnow, index=True)
    generated_by = Column(String(50), default="catalog_agent")
    
    def __repr__(self):
        return f"<Metadata(id={self.id}, column_id={self.column_id})>"
