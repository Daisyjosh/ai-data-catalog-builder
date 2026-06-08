"""Audit Log Model"""

from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from backend.database.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(50), nullable=False, index=True)  # CREATE, UPDATE, DELETE, GENERATE, SEARCH
    entity_type = Column(String(50), nullable=False, index=True)  # Dataset, Table, Column, Metadata
    entity_id = Column(Integer, nullable=False)
    user_id = Column(String(100), default="system")
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    details = Column(Text)  # JSON with change details
    
    def __repr__(self):
        return f"<AuditLog(id={self.id}, action={self.action})>"
