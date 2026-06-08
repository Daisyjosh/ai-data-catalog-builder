"""Agent Log Model"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from datetime import datetime
from backend.database.base import Base

class AgentLog(Base):
    __tablename__ = "agent_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    agent_run_id = Column(Integer, ForeignKey("agent_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    log_level = Column(String(10), nullable=False, default="INFO", index=True)  # DEBUG, INFO, WARNING, ERROR
    message = Column(Text, nullable=False)
    context = Column(Text)  # JSON with contextual information
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    
    def __repr__(self):
        return f"<AgentLog(id={self.id}, level={self.log_level})>"
