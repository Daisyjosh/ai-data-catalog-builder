"""Agent Run Model"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from datetime import datetime
from backend.database.base import Base

class AgentRun(Base):
    __tablename__ = "agent_runs"
    
    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(20), nullable=False, default="Running", index=True)  # Running, Completed, Failed, Paused
    started_at = Column(DateTime, default=datetime.utcnow, index=True)
    completed_at = Column(DateTime)
    duration_seconds = Column(Integer)
    total_tables_processed = Column(Integer, default=0)
    total_columns_processed = Column(Integer, default=0)
    total_metadata_generated = Column(Integer, default=0)
    error_message = Column(Text)
    metadata = Column(Text)  # JSON with execution details
    
    def __repr__(self):
        return f"<AgentRun(id={self.id}, dataset_id={self.dataset_id}, status={self.status})>"
