"""Application Constants"""

# Data Types
VALID_DATA_TYPES = {
    "String",
    "Integer",
    "Float",
    "Boolean",
    "Date",
    "DateTime",
    "JSON",
    "Unknown"
}

# Sensitivity Levels
VALID_SENSITIVITY_LEVELS = {
    "Public",
    "Internal",
    "Confidential"
}

# Agent Status
AGENT_STATUS = {
    "RUNNING": "Running",
    "COMPLETED": "Completed",
    "FAILED": "Failed",
    "PAUSED": "Paused"
}

# Log Levels
LOG_LEVELS = {
    "DEBUG",
    "INFO",
    "WARNING",
    "ERROR"
}

# File Upload
ALLOWED_EXTENSIONS = {"csv", "json", "db", "sqlite"}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB
