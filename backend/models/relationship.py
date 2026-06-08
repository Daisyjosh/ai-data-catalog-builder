"""Relationship Model"""

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from backend.database.base import Base

class Relationship(Base):
    __tablename__ = "relationships"
    
    id = Column(Integer, primary_key=True, index=True)
    source_column_id = Column(Integer, ForeignKey("columns.id", ondelete="CASCADE"), nullable=False, index=True)
    target_column_id = Column(Integer, ForeignKey("columns.id", ondelete="CASCADE"), nullable=False, index=True)
    relationship_type = Column(String(50), nullable=False)  # ForeignKey, OneToOne, OneToMany, ManyToMany, Potential
    confidence = Column(Float, default=0.0)  # 0-1 confidence score
    detected_by = Column(String(50), default="schema_analyzer")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    def __repr__(self):
        return f"<Relationship(source={self.source_column_id}, target={self.target_column_id})>"
