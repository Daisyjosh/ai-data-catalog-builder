# AI Data Catalog Builder - API Contracts

## Overview

This document defines all API contracts for the AI Data Catalog Builder, including REST endpoints, Pydantic models, WebSocket schemas, and OpenAPI specifications.

---

## Pydantic Models (Request/Response Schemas)

### Core Models

#### DatasetBase
```python
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime

class DatasetBase(BaseModel):
    """Base schema for dataset operations"""
    name: str = Field(..., min_length=1, max_length=255, description="Dataset name")
    description: Optional[str] = Field(None, max_length=2000, description="Dataset description")
    
    @validator('name')
    def name_valid(cls, v):
        if not v.isidentifier() and not all(c.isalnum() or c in '_- ' for c in v):
            raise ValueError('Dataset name contains invalid characters')
        return v.strip()

class DatasetCreate(DatasetBase):
    """Schema for dataset creation"""
    pass

class DatasetUpdate(BaseModel):
    """Schema for dataset updates"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)

class DatasetResponse(DatasetBase):
    """Schema for dataset responses"""
    id: int
    source_type: str = Field(..., description="CSV, JSON, or SQLite")
    file_size_bytes: int
    row_count: Optional[int]
    metadata_generated: bool
    created_at: datetime
    updated_at: datetime
    table_count: Optional[int] = None
    
    class Config:
        from_attributes = True
```

#### TableBase
```python
class TableBase(BaseModel):
    """Base schema for table operations"""
    name: str = Field(..., min_length=1, max_length=255, description="Table name")
    description: Optional[str] = Field(None, max_length=2000)

class TableCreate(TableBase):
    """Schema for table creation"""
    dataset_id: int
    row_count: int = Field(..., ge=0, description="Number of rows")

class TableResponse(TableBase):
    """Schema for table responses"""
    id: int
    dataset_id: int
    row_count: int
    metadata_generated: bool
    column_count: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
```

#### ColumnBase
```python
class ColumnBase(BaseModel):
    """Base schema for column operations"""
    name: str = Field(..., min_length=1, max_length=255, description="Column name")
    data_type: str = Field(..., description="String, Integer, Float, Boolean, Date, DateTime, JSON, Unknown")
    nullable: bool = Field(True, description="Whether column allows NULL values")

class ColumnCreate(ColumnBase):
    """Schema for column creation"""
    table_id: int
    sample_values: Optional[List[str]] = Field(None, max_items=5, description="Up to 5 sample values")

class ColumnResponse(ColumnBase):
    """Schema for column responses"""
    id: int
    table_id: int
    sample_values: Optional[List[str]]
    metadata_generated: bool
    created_at: datetime
    updated_at: datetime
    metadata: Optional['MetadataResponse'] = None
    
    class Config:
        from_attributes = True
```

#### MetadataBase
```python
class MetadataBase(BaseModel):
    """Base schema for metadata operations"""
    business_description: str = Field(..., min_length=10, max_length=500, description="Business-friendly description")
    business_category: Optional[str] = Field(None, max_length=100, description="Category classification")
    tags: Optional[List[str]] = Field(None, max_items=5, description="Relevant tags")
    sensitivity_level: str = Field("Internal", description="Public, Internal, or Confidential")
    
    @validator('sensitivity_level')
    def validate_sensitivity(cls, v):
        if v not in ['Public', 'Internal', 'Confidential']:
            raise ValueError('Invalid sensitivity level')
        return v
    
    @validator('tags')
    def validate_tags(cls, v):
        if v:
            return [tag.strip().lower() for tag in v if tag.strip()]
        return v

class MetadataCreate(MetadataBase):
    """Schema for metadata creation"""
    column_id: int

class MetadataResponse(MetadataBase):
    """Schema for metadata responses"""
    id: int
    column_id: int
    embedding_model: Optional[str]
    generated_at: datetime
    generated_by: str
    
    class Config:
        from_attributes = True
```

#### AgentRunBase
```python
class AgentRunBase(BaseModel):
    """Base schema for agent runs"""
    dataset_id: int

class AgentRunCreate(AgentRunBase):
    """Schema for creating agent runs"""
    pass

class AgentRunResponse(AgentRunBase):
    """Schema for agent run responses"""
    id: int
    status: str = Field(..., description="Running, Completed, Failed, Paused")
    started_at: datetime
    completed_at: Optional[datetime] = None
    duration_seconds: Optional[int] = None
    total_tables_processed: int = 0
    total_columns_processed: int = 0
    total_metadata_generated: int = 0
    error_message: Optional[str] = None
    
    class Config:
        from_attributes = True

class AgentLogResponse(BaseModel):
    """Schema for agent logs"""
    id: int
    agent_run_id: int
    log_level: str = Field(..., description="DEBUG, INFO, WARNING, ERROR")
    message: str
    context: Optional[dict]
    timestamp: datetime
    
    class Config:
        from_attributes = True
```

#### SearchModels
```python
class SearchQuery(BaseModel):
    """Schema for search requests"""
    query: str = Field(..., min_length=1, max_length=500, description="Search query")
    search_type: str = Field("semantic", description="keyword or semantic")
    limit: int = Field(10, ge=1, le=100, description="Max results to return")
    offset: int = Field(0, ge=0, description="Pagination offset")
    filters: Optional[dict] = Field(None, description="Optional filters (category, sensitivity, etc.)")

class SearchResult(BaseModel):
    """Schema for search results"""
    column_id: int
    column_name: str
    table_name: str
    dataset_name: str
    metadata: Optional[MetadataResponse]
    similarity_score: Optional[float] = Field(None, ge=0, le=1, description="For semantic search")

class SearchResponse(BaseModel):
    """Schema for search responses"""
    query: str
    search_type: str
    total_results: int
    results: List[SearchResult]
    execution_time_ms: float
```

#### DashboardMetrics
```python
class DashboardMetrics(BaseModel):
    """Schema for dashboard metrics"""
    total_datasets: int
    total_tables: int
    total_columns: int
    metadata_generated: int
    metadata_pending: int
    agent_runs_total: int
    agent_runs_running: int
    agent_runs_failed: int
    search_count_today: int
    recent_uploads: List[DatasetResponse]
    recent_agent_runs: List[AgentRunResponse]
    processing_status: dict

class ActivityLog(BaseModel):
    """Schema for activity logs"""
    id: int
    action: str
    entity_type: str
    timestamp: datetime
    details: Optional[dict]
```

#### ErrorResponse
```python
class ErrorDetail(BaseModel):
    """Schema for error details"""
    field: Optional[str] = None
    message: str
    code: str

class ErrorResponse(BaseModel):
    """Standard error response"""
    status: int
    error: str
    details: Optional[List[ErrorDetail]] = None
    timestamp: datetime
    request_id: str
```

---

## REST API Endpoints

### Authentication
All endpoints support optional bearer token authentication. If no token provided, requests are treated as public/system user.

```
Authorization: Bearer <token>
```

### Base URL
```
https://api.example.com/api
```

---

### Dataset Endpoints

#### POST /datasets/upload
**Upload a new dataset (CSV, JSON, or SQLite)**

```http
POST /datasets/upload HTTP/1.1
Content-Type: multipart/form-data

file: <binary_file_data>
dataset_name: "customers"
description: "Customer master data"
trigger_agent: true
```

**Response: 202 Accepted**
```json
{
  "id": 1,
  "name": "customers",
  "description": "Customer master data",
  "source_type": "CSV",
  "file_size_bytes": 1024000,
  "metadata_generated": false,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid file format or missing name
- `413 Payload Too Large`: File exceeds max size (100MB)
- `422 Unprocessable Entity`: Invalid dataset name

---

#### GET /datasets
**List all datasets with pagination**

```http
GET /datasets?page=1&page_size=20&metadata_generated=false HTTP/1.1
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)
- `metadata_generated`: Filter by generation status (optional)
- `source_type`: Filter by type: CSV, JSON, SQLite (optional)

**Response: 200 OK**
```json
{
  "total": 45,
  "page": 1,
  "page_size": 20,
  "items": [
    {
      "id": 1,
      "name": "customers",
      "description": "Customer master data",
      "source_type": "CSV",
      "file_size_bytes": 1024000,
      "row_count": 10000,
      "metadata_generated": true,
      "table_count": 1,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:35:00Z"
    }
  ]
}
```

---

#### GET /datasets/{id}
**Get dataset details**

```http
GET /datasets/1 HTTP/1.1
```

**Response: 200 OK**
```json
{
  "id": 1,
  "name": "customers",
  "description": "Customer master data",
  "source_type": "CSV",
  "file_size_bytes": 1024000,
  "row_count": 10000,
  "metadata_generated": true,
  "table_count": 1,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:35:00Z"
}
```

**Error Response: 404 Not Found**

---

#### PUT /datasets/{id}
**Update dataset metadata**

```http
PUT /datasets/1 HTTP/1.1
Content-Type: application/json

{
  "name": "customers_v2",
  "description": "Updated customer master data"
}
```

**Response: 200 OK**

---

#### DELETE /datasets/{id}
**Delete dataset (cascades to tables, columns, metadata)**

```http
DELETE /datasets/1 HTTP/1.1
```

**Response: 204 No Content**

---

### Table Endpoints

#### GET /datasets/{dataset_id}/tables
**List tables in a dataset**

```http
GET /datasets/1/tables?page=1&page_size=20 HTTP/1.1
```

**Response: 200 OK**
```json
{
  "total": 5,
  "page": 1,
  "page_size": 20,
  "items": [
    {
      "id": 1,
      "dataset_id": 1,
      "name": "customers",
      "row_count": 10000,
      "description": "Customer records",
      "metadata_generated": true,
      "column_count": 15,
      "created_at": "2024-01-15T10:31:00Z",
      "updated_at": "2024-01-15T10:31:00Z"
    }
  ]
}
```

---

#### GET /tables/{id}
**Get table schema and details**

```http
GET /tables/1 HTTP/1.1
```

**Response: 200 OK**
```json
{
  "id": 1,
  "dataset_id": 1,
  "name": "customers",
  "row_count": 10000,
  "description": "Customer records",
  "metadata_generated": true,
  "column_count": 15,
  "created_at": "2024-01-15T10:31:00Z",
  "updated_at": "2024-01-15T10:31:00Z"
}
```

---

### Column Endpoints

#### GET /tables/{table_id}/columns
**List columns in a table**

```http
GET /tables/1/columns?page=1&page_size=50 HTTP/1.1
```

**Response: 200 OK**
```json
{
  "total": 15,
  "page": 1,
  "page_size": 50,
  "items": [
    {
      "id": 1,
      "table_id": 1,
      "name": "customer_id",
      "data_type": "Integer",
      "nullable": false,
      "sample_values": ["1001", "1002", "1003", "1004", "1005"],
      "metadata_generated": true,
      "created_at": "2024-01-15T10:31:00Z",
      "updated_at": "2024-01-15T10:31:00Z",
      "metadata": {
        "id": 1,
        "column_id": 1,
        "business_description": "Unique identifier assigned to a customer",
        "business_category": "Customer",
        "tags": ["identifier", "primary_key", "customer"],
        "sensitivity_level": "Internal",
        "generated_at": "2024-01-15T10:32:00Z"
      }
    }
  ]
}
```

---

#### GET /columns/{id}
**Get column details with metadata**

```http
GET /columns/1 HTTP/1.1
```

**Response: 200 OK**

---

### Metadata Endpoints

#### GET /metadata/{column_id}
**Get metadata for a column**

```http
GET /metadata/1 HTTP/1.1
```

**Response: 200 OK**
```json
{
  "id": 1,
  "column_id": 1,
  "business_description": "Unique identifier assigned to a customer",
  "business_category": "Customer",
  "tags": ["identifier", "primary_key", "customer"],
  "sensitivity_level": "Internal",
  "embedding_model": "gemini-embedding-001",
  "generated_at": "2024-01-15T10:32:00Z",
  "generated_by": "catalog_agent"
}
```

---

#### POST /metadata/regenerate/{column_id}
**Regenerate metadata for a column using Gemini**

```http
POST /metadata/regenerate/1 HTTP/1.1
```

**Response: 202 Accepted**
```json
{
  "id": 1,
  "column_id": 1,
  "status": "processing"
}
```

---

### Search Endpoints

#### POST /search
**Perform semantic or keyword search**

```http
POST /search HTTP/1.1
Content-Type: application/json

{
  "query": "customer information",
  "search_type": "semantic",
  "limit": 20,
  "offset": 0,
  "filters": {
    "sensitivity_level": "Public",
    "business_category": "Customer"
  }
}
```

**Response: 200 OK**
```json
{
  "query": "customer information",
  "search_type": "semantic",
  "total_results": 8,
  "results": [
    {
      "column_id": 1,
      "column_name": "customer_id",
      "table_name": "customers",
      "dataset_name": "sales_db",
      "similarity_score": 0.95,
      "metadata": {
        "id": 1,
        "column_id": 1,
        "business_description": "Unique identifier assigned to a customer",
        "business_category": "Customer",
        "tags": ["identifier", "primary_key"],
        "sensitivity_level": "Internal"
      }
    }
  ],
  "execution_time_ms": 245
}
```

---

#### GET /search/suggest
**Get search suggestions based on prefix**

```http
GET /search/suggest?q=cust&limit=5 HTTP/1.1
```

**Response: 200 OK**
```json
{
  "suggestions": [
    "customer_id",
    "customer_name",
    "customer_status",
    "customer_email",
    "customer_phone"
  ]
}
```

---

### Agent Endpoints

#### POST /agent/run
**Start agent processing for a dataset**

```http
POST /agent/run HTTP/1.1
Content-Type: application/json

{
  "dataset_id": 1
}
```

**Response: 202 Accepted**
```json
{
  "id": 1,
  "dataset_id": 1,
  "status": "Running",
  "started_at": "2024-01-15T10:35:00Z",
  "completed_at": null,
  "duration_seconds": null,
  "total_tables_processed": 0,
  "total_columns_processed": 0,
  "total_metadata_generated": 0,
  "error_message": null
}
```

---

#### GET /agent/runs
**List agent execution runs**

```http
GET /agent/runs?status=Completed&limit=20 HTTP/1.1
```

**Query Parameters**:
- `status`: Running, Completed, Failed, Paused (optional)
- `dataset_id`: Filter by dataset (optional)
- `limit`: Max results (default: 20)
- `offset`: Pagination offset (default: 0)

**Response: 200 OK**
```json
{
  "total": 5,
  "items": [
    {
      "id": 1,
      "dataset_id": 1,
      "status": "Completed",
      "started_at": "2024-01-15T10:35:00Z",
      "completed_at": "2024-01-15T10:37:15Z",
      "duration_seconds": 135,
      "total_tables_processed": 5,
      "total_columns_processed": 42,
      "total_metadata_generated": 42,
      "error_message": null
    }
  ]
}
```

---

#### GET /agent/runs/{id}
**Get details of a specific agent run**

```http
GET /agent/runs/1 HTTP/1.1
```

**Response: 200 OK**
```json
{
  "id": 1,
  "dataset_id": 1,
  "status": "Completed",
  "started_at": "2024-01-15T10:35:00Z",
  "completed_at": "2024-01-15T10:37:15Z",
  "duration_seconds": 135,
  "total_tables_processed": 5,
  "total_columns_processed": 42,
  "total_metadata_generated": 42,
  "error_message": null
}
```

---

#### GET /agent/runs/{id}/logs
**Get logs from a specific agent run**

```http
GET /agent/runs/1/logs?log_level=ERROR&limit=50 HTTP/1.1
```

**Query Parameters**:
- `log_level`: DEBUG, INFO, WARNING, ERROR (optional)
- `limit`: Max results (default: 50)
- `offset`: Pagination offset (default: 0)

**Response: 200 OK**
```json
{
  "total": 3,
  "items": [
    {
      "id": 1,
      "agent_run_id": 1,
      "log_level": "INFO",
      "message": "Starting analysis of dataset: customers",
      "context": {
        "step": "SCAN",
        "current_table": "customers",
        "total_tables": 5
      },
      "timestamp": "2024-01-15T10:35:10Z"
    }
  ]
}
```

---

#### POST /agent/runs/{id}/pause
**Pause a running agent**

```http
POST /agent/runs/1/pause HTTP/1.1
```

**Response: 200 OK**
```json
{
  "id": 1,
  "status": "Paused"
}
```

---

#### POST /agent/runs/{id}/resume
**Resume a paused agent**

```http
POST /agent/runs/1/resume HTTP/1.1
```

**Response: 200 OK**
```json
{
  "id": 1,
  "status": "Running"
}
```

---

#### DELETE /agent/runs/{id}
**Cancel/delete an agent run**

```http
DELETE /agent/runs/1 HTTP/1.1
```

**Response: 204 No Content**

---

### Dashboard Endpoints

#### GET /dashboard/metrics
**Get dashboard metrics and statistics**

```http
GET /dashboard/metrics HTTP/1.1
```

**Response: 200 OK**
```json
{
  "total_datasets": 12,
  "total_tables": 45,
  "total_columns": 342,
  "metadata_generated": 285,
  "metadata_pending": 57,
  "agent_runs_total": 15,
  "agent_runs_running": 1,
  "agent_runs_failed": 2,
  "search_count_today": 156,
  "recent_uploads": [
    {
      "id": 12,
      "name": "products_latest",
      "created_at": "2024-01-15T09:30:00Z"
    }
  ],
  "recent_agent_runs": [
    {
      "id": 15,
      "dataset_id": 12,
      "status": "Running",
      "started_at": "2024-01-15T10:35:00Z"
    }
  ],
  "processing_status": {
    "pending_datasets": 2,
    "processing_datasets": 1,
    "completed_datasets": 9
  }
}
```

---

#### GET /dashboard/activity
**Get recent activity log**

```http
GET /dashboard/activity?limit=20 HTTP/1.1
```

**Response: 200 OK**
```json
{
  "total": 156,
  "items": [
    {
      "id": 1,
      "action": "UPLOAD",
      "entity_type": "Dataset",
      "timestamp": "2024-01-15T10:35:00Z",
      "details": {
        "dataset_id": 12,
        "file_size": 1024000
      }
    }
  ]
}
```

---

## WebSocket Contracts

### Connection
```javascript
const ws = new WebSocket('wss://api.example.com/ws/agent/{agent_run_id}');
```

### Message Types

#### Progress Update
```json
{
  "type": "progress",
  "data": {
    "status": "Running",
    "current_table": "customers",
    "current_column": "customer_id",
    "tables_processed": 2,
    "columns_processed": 8,
    "tables_total": 5,
    "columns_total": 42,
    "progress_percentage": 19
  }
}
```

#### Log Message
```json
{
  "type": "log",
  "data": {
    "log_level": "INFO",
    "message": "Generating metadata for column: customer_id",
    "context": {
      "step": "GEMINI_CALL",
      "gemini_tokens_used": 245
    },
    "timestamp": "2024-01-15T10:35:30Z"
  }
}
```

#### Completion
```json
{
  "type": "completion",
  "data": {
    "status": "Completed",
    "duration_seconds": 135,
    "total_tables_processed": 5,
    "total_columns_processed": 42,
    "total_metadata_generated": 42,
    "completed_at": "2024-01-15T10:37:15Z"
  }
}
```

#### Error
```json
{
  "type": "error",
  "data": {
    "error_code": "GEMINI_API_ERROR",
    "message": "Failed to generate metadata for column: customer_id",
    "recoverable": true,
    "retry_count": 1,
    "timestamp": "2024-01-15T10:35:35Z"
  }
}
```

---

## Status Codes

| Code | Status | Usage |
|------|--------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST creating a resource |
| 202 | Accepted | Async operation initiated (upload, agent run) |
| 204 | No Content | Successful DELETE or empty response |
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists or conflict |
| 413 | Payload Too Large | File exceeds max size |
| 422 | Unprocessable Entity | Validation error with details |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service down or Gemini API unavailable |

---

## Error Handling

### Standard Error Response Format

```json
{
  "status": 422,
  "error": "Validation Error",
  "details": [
    {
      "field": "name",
      "message": "Dataset name must be between 1 and 255 characters",
      "code": "value_error.string.too_short"
    }
  ],
  "timestamp": "2024-01-15T10:35:00Z",
  "request_id": "req_abc123def456"
}
```

### Common Error Scenarios

**Missing Required Field**:
```json
{
  "status": 422,
  "error": "Validation Error",
  "details": [
    {
      "field": "query",
      "message": "Field required",
      "code": "value_error.missing"
    }
  ]
}
```

**Invalid File Format**:
```json
{
  "status": 400,
  "error": "Invalid File Format",
  "details": [
    {
      "field": "file",
      "message": "Only CSV, JSON, and SQLite files are supported",
      "code": "file_error.invalid_format"
    }
  ]
}
```

**Rate Limit**:
```json
{
  "status": 429,
  "error": "Rate Limit Exceeded",
  "details": [
    {
      "message": "Too many requests. Please retry after 60 seconds",
      "code": "rate_limit.exceeded"
    }
  ],
  "headers": {
    "Retry-After": 60
  }
}
```

---

## Validation Rules

### Dataset Validation
- Name: 1-255 alphanumeric characters, spaces, hyphens, underscores
- Description: Max 2000 characters
- File size: 1 KB - 100 MB
- Supported types: CSV, JSON, SQLite
- File name: unique per system

### Table Validation
- Name: 1-255 characters, unique per dataset
- Row count: >= 0
- Description: Max 2000 characters

### Column Validation
- Name: 1-255 characters, unique per table
- Data type: One of String, Integer, Float, Boolean, Date, DateTime, JSON, Unknown
- Sample values: Max 5 items

### Metadata Validation
- Business description: 10-500 characters
- Business category: Max 100 characters
- Tags: Max 5 items, each max 50 characters
- Sensitivity level: Public, Internal, or Confidential

### Search Validation
- Query: 1-500 characters
- Search type: "keyword" or "semantic"
- Limit: 1-100
- Offset: >= 0

---

## OpenAPI/Swagger Specification

### Base Configuration

```yaml
openapi: 3.0.0
info:
  title: AI Data Catalog Builder API
  version: 1.0.0
  description: REST API for AI-powered dataset cataloging with agent-based metadata generation
  contact:
    name: Support
    email: support@example.com
  license:
    name: MIT

servers:
  - url: https://api.example.com/api
    description: Production API
  - url: http://localhost:8000/api
    description: Development API

tags:
  - name: Datasets
    description: Dataset management operations
  - name: Tables
    description: Table discovery and schema
  - name: Columns
    description: Column information and details
  - name: Metadata
    description: Business metadata operations
  - name: Search
    description: Semantic and keyword search
  - name: Agent
    description: AI agent control and monitoring
  - name: Dashboard
    description: Metrics and analytics
  - name: WebSocket
    description: Real-time agent monitoring

paths:
  /datasets/upload:
    post:
      summary: Upload a new dataset
      tags:
        - Datasets
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
                  description: CSV, JSON, or SQLite file
                dataset_name:
                  type: string
                  description: Name for the dataset
                description:
                  type: string
                  description: Optional description
                trigger_agent:
                  type: boolean
                  default: true
                  description: Whether to automatically start agent processing
      responses:
        '202':
          description: Dataset upload accepted
        '400':
          description: Invalid request
        '413':
          description: File too large

security:
  - bearerAuth: []
  - {}

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Optional JWT token for authentication
```

---

## Rate Limiting

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1705327200
```

**Limits**:
- Public endpoints: 100 requests/minute
- Authenticated endpoints: 1000 requests/minute
- Upload endpoint: 10 requests/minute
- Gemini API calls: 100 requests/minute (shared quota)

---

## Pagination

All list endpoints support pagination:

```
GET /datasets?page=1&page_size=20
```

**Response Format**:
```json
{
  "total": 45,
  "page": 1,
  "page_size": 20,
  "total_pages": 3,
  "has_next": true,
  "has_previous": false,
  "items": [...]
}
```

---

## Sorting and Filtering

**Sorting**:
```
GET /datasets?sort=-created_at,name
```

**Filtering**:
```
GET /datasets?metadata_generated=true&source_type=CSV
```

---

**✓ STEP 3: API Contracts Complete**

Creating STEP 4: MCP Architecture...
