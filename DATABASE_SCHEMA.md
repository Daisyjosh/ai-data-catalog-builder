# AI Data Catalog Builder - Database Schema & ER Diagram

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                         DATASETS (1)                                   │
│  ┌──────────────────────────────────────────────┐                      │
│  │ id (PK)                                      │                      │
│  │ name                                         │                      │
│  │ description                                  │ 1:N                  │
│  │ source_type (CSV|JSON|SQLite)               │──────┐               │
│  │ file_path                                    │      │               │
│  │ file_size_bytes                              │      │               │
│  │ row_count                                    │      │               │
│  │ metadata_generated (boolean)                 │      │               │
│  │ created_at                                   │      │               │
│  │ updated_at                                   │      │               │
│  └──────────────────────────────────────────────┘      │               │
│           ▲                                             │               │
│           │                                             │               │
│           │ 1:N                           ┌─────────────▼───────────────┐
│           │                               │         TABLES (N)          │
│           │                               │ ┌──────────────────────────┐│
│           │                               │ │ id (PK)                  ││
│           │                               │ │ dataset_id (FK)          ││
│           │                               │ │ name                     ││
│           │                               │ │ row_count                ││
│           │                               │ │ description              ││
│           │                               │ │ metadata_generated       ││
│           │                               │ │ created_at               ││
│           │                               │ │ updated_at               ││
│           │                               │ └──────────────────────────┘│
│           │                               │           ▲                 │
│           │                               │           │ 1:N             │
│           │                               └───────────┼─────────────────┘
│           │                                           │
│           │                            ┌──────────────▼────────────────┐
│           │                            │      COLUMNS (N)              │
│           │                            │ ┌──────────────────────────┐ │
│           │                            │ │ id (PK)                  │ │
│           │                            │ │ table_id (FK)            │ │
│           │                            │ │ name                     │ │
│           │                            │ │ data_type                │ │
│           │                            │ │ nullable                 │ │
│           │                            │ │ sample_values (JSON)     │ │
│           │                            │ │ metadata_generated       │ │
│           │                            │ │ created_at               │ │
│           │                            │ │ updated_at               │ │
│           │                            │ └──────────────────────────┘ │
│           │                            │           ▲                   │
│           │                            │           │ 1:1               │
│           │                            └───────────┼───────────────────┘
│           │                                        │
│           │                     ┌──────────────────▼──────────────┐
│           │                     │      METADATA (1)               │
│           │                     │ ┌──────────────────────────┐   │
│           │                     │ │ id (PK)                  │   │
│           │                     │ │ column_id (FK)           │   │
│           │                     │ │ business_description     │   │
│           │                     │ │ business_category        │   │
│           │                     │ │ tags (JSON)              │   │
│           │                     │ │ sensitivity_level        │   │
│           │                     │ │ embedding (BLOB)         │   │
│           │                     │ │ embedding_model          │   │
│           │                     │ │ generated_at             │   │
│           │                     │ │ generated_by             │   │
│           │                     │ └──────────────────────────┘   │
│           │                     └─────────────────────────────────┘
│           │
│           └─────────────────┐
│                             │
│        ┌────────────────────▼──────────────────┐
│        │    AGENT_RUNS (N)                     │
│        │ ┌──────────────────────────────────┐ │
│        │ │ id (PK)                          │ │
│        │ │ dataset_id (FK)                  │ │
│        │ │ status (Running|Completed|Failed)│ │
│        │ │ started_at                       │ │
│        │ │ completed_at                     │ │
│        │ │ duration_seconds                 │ │
│        │ │ metadata (JSON)                  │ │
│        │ │ created_at                       │ │
│        │ └──────────────────────────────────┘ │
│        │           ▲                           │
│        │           │ 1:N                       │
│        └─────────��─┼───────────────────────────┘
│                    │
│     ┌──────────────▼──────────────┐
│     │    AGENT_LOGS (N)           │
│     │ ┌──────────────────────────┐│
│     │ │ id (PK)                  ││
│     │ │ agent_run_id (FK)        ││
│     │ │ log_level                ││
│     │ │ message                  ││
│     │ │ context (JSON)           ││
│     │ │ timestamp                ││
│     │ └──────────────────────────┘│
│     └────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                   RELATIONSHIPS & AUDIT TABLES                         │
│                                                                         │
│  ┌────────────────────────────┐      ┌────────────────────────────┐   │
│  │   RELATIONSHIPS (N:M)       │      │    AUDIT_LOGS (N)          │   │
│  │ ┌──────────────────────────┐│      │ ┌──────────────────────────┐ │
│  │ │ id (PK)                  ││      │ │ id (PK)                  │ │
│  │ │ source_column_id (FK)    ││      │ │ action                   │ │
│  │ │ target_column_id (FK)    ││      │ │ entity_type              │ │
│  │ │ relationship_type        ││      │ │ entity_id                │ │
│  │ │ confidence (0-1)         ││      │ │ user_id                  │ │
│  │ │ detected_by              ││      │ │ timestamp                │ │
│  │ │ created_at               ││      │ │ details (JSON)           │ │
│  │ ���──────────────────────────┘│      │ └──────────────────────────┘ │
│  └────────────────────────────┘      └────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────────────┘
```

## Database Schema Details

### 1. DATASETS Table

**Purpose**: Store uploaded dataset metadata and file references

```sql
CREATE TABLE datasets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    source_type VARCHAR(20) NOT NULL CHECK(source_type IN ('CSV', 'JSON', 'SQLite')),
    file_path VARCHAR(512) NOT NULL UNIQUE,
    file_size_bytes INTEGER NOT NULL,
    row_count INTEGER,
    metadata_generated BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    CONSTRAINT chk_positive_size CHECK(file_size_bytes > 0)
);

CREATE INDEX idx_datasets_created_at ON datasets(created_at);
CREATE INDEX idx_datasets_metadata_generated ON datasets(metadata_generated);
CREATE INDEX idx_datasets_source_type ON datasets(source_type);
CREATE FULLTEXT INDEX idx_datasets_fts ON datasets(name, description);
```

**Fields**:
- `id`: Unique identifier
- `name`: Dataset name (unique)
- `description`: User/system provided description
- `source_type`: CSV, JSON, or SQLite Database
- `file_path`: Location on disk
- `file_size_bytes`: Original file size for quota tracking
- `row_count`: Total rows in largest table
- `metadata_generated`: Whether metadata generation completed
- `created_at`: Upload timestamp
- `updated_at`: Last modification timestamp

---

### 2. TABLES Table

**Purpose**: Store table/collection metadata within datasets

```sql
CREATE TABLE tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dataset_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    row_count INTEGER NOT NULL,
    description TEXT,
    metadata_generated BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE,
    UNIQUE(dataset_id, name),
    CONSTRAINT chk_positive_rows CHECK(row_count >= 0)
);

CREATE INDEX idx_tables_dataset_id ON tables(dataset_id);
CREATE INDEX idx_tables_metadata_generated ON tables(metadata_generated);
CREATE INDEX idx_tables_created_at ON tables(created_at);
CREATE FULLTEXT INDEX idx_tables_fts ON tables(name, description);
```

**Fields**:
- `id`: Unique identifier
- `dataset_id`: Foreign key to datasets
- `name`: Table/collection name
- `row_count`: Number of rows
- `description`: Generated or user-provided
- `metadata_generated`: Processing flag
- `created_at`: Discovery timestamp
- `updated_at`: Last update timestamp

**Cascade**: Deleting dataset deletes all tables

---

### 3. COLUMNS Table

**Purpose**: Store column/field schema information

```sql
CREATE TABLE columns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    data_type VARCHAR(50) NOT NULL CHECK(data_type IN ('String', 'Integer', 'Float', 'Boolean', 'Date', 'DateTime', 'JSON', 'Unknown')),
    nullable BOOLEAN DEFAULT 1,
    sample_values TEXT,  -- JSON array of up to 5 sample values
    metadata_generated BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE,
    UNIQUE(table_id, name)
);

CREATE INDEX idx_columns_table_id ON columns(table_id);
CREATE INDEX idx_columns_data_type ON columns(data_type);
CREATE INDEX idx_columns_metadata_generated ON columns(metadata_generated);
CREATE FULLTEXT INDEX idx_columns_fts ON columns(name);
```

**Fields**:
- `id`: Unique identifier
- `table_id`: Foreign key to tables
- `name`: Column name
- `data_type`: Inferred data type (String, Integer, Float, Boolean, Date, DateTime, JSON, Unknown)
- `nullable`: Whether column allows NULL values
- `sample_values`: JSON array of sample values for context
- `metadata_generated`: Processing flag
- `created_at`: Discovery timestamp
- `updated_at`: Last update timestamp

**Sample Values Format**:
```json
["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-18", "2024-01-19"]
```

---

### 4. METADATA Table

**Purpose**: Store AI-generated business metadata for columns

```sql
CREATE TABLE metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    column_id INTEGER NOT NULL UNIQUE,
    business_description TEXT NOT NULL,
    business_category VARCHAR(100),  -- Customer, Financial, Location, Product, etc.
    tags TEXT,  -- JSON array of tags
    sensitivity_level VARCHAR(20) CHECK(sensitivity_level IN ('Public', 'Internal', 'Confidential')) DEFAULT 'Internal',
    embedding BLOB,  -- Binary serialized embedding vector
    embedding_model VARCHAR(50) DEFAULT 'gemini-embedding-001',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generated_by VARCHAR(50) DEFAULT 'catalog_agent',
    
    FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE
);

CREATE INDEX idx_metadata_column_id ON metadata(column_id);
CREATE INDEX idx_metadata_sensitivity_level ON metadata(sensitivity_level);
CREATE INDEX idx_metadata_business_category ON metadata(business_category);
CREATE INDEX idx_metadata_generated_at ON metadata(generated_at);
CREATE FULLTEXT INDEX idx_metadata_fts ON metadata(business_description, business_category, tags);
```

**Fields**:
- `id`: Unique identifier
- `column_id`: Foreign key to columns (1:1 relationship)
- `business_description`: AI-generated description (1-2 sentences)
- `business_category`: Category classification
- `tags`: JSON array of tags (max 5)
- `sensitivity_level`: Data classification (Public, Internal, Confidential)
- `embedding`: Binary vector for semantic search (768 dimensions for Gemini)
- `embedding_model`: Which model generated the embedding
- `generated_at`: Timestamp of generation
- `generated_by`: Source (catalog_agent, user, etc.)

**Tags Format**:
```json
["customer_identifier", "primary_key", "customer_management", "billing"]
```

---

### 5. RELATIONSHIPS Table

**Purpose**: Store detected relationships between columns (e.g., foreign keys)

```sql
CREATE TABLE relationships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_column_id INTEGER NOT NULL,
    target_column_id INTEGER NOT NULL,
    relationship_type VARCHAR(50) NOT NULL CHECK(relationship_type IN ('ForeignKey', 'OneToOne', 'OneToMany', 'ManyToMany', 'Potential')),
    confidence FLOAT DEFAULT 0.0 CHECK(confidence >= 0 AND confidence <= 1),
    detected_by VARCHAR(50) DEFAULT 'schema_analyzer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (source_column_id) REFERENCES columns(id) ON DELETE CASCADE,
    FOREIGN KEY (target_column_id) REFERENCES columns(id) ON DELETE CASCADE,
    CONSTRAINT chk_different_columns CHECK(source_column_id != target_column_id)
);

CREATE INDEX idx_relationships_source ON relationships(source_column_id);
CREATE INDEX idx_relationships_target ON relationships(target_column_id);
CREATE INDEX idx_relationships_type ON relationships(relationship_type);
CREATE INDEX idx_relationships_confidence ON relationships(confidence);
```

**Fields**:
- `id`: Unique identifier
- `source_column_id`: FK to source column
- `target_column_id`: FK to target column
- `relationship_type`: Type of relationship detected
- `confidence`: Confidence score (0-1)
- `detected_by`: Detection method
- `created_at`: Discovery timestamp

---

### 6. AGENT_RUNS Table

**Purpose**: Track autonomous agent execution sessions

```sql
CREATE TABLE agent_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dataset_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL CHECK(status IN ('Running', 'Completed', 'Failed', 'Paused')) DEFAULT 'Running',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    duration_seconds INTEGER,
    total_tables_processed INTEGER DEFAULT 0,
    total_columns_processed INTEGER DEFAULT 0,
    total_metadata_generated INTEGER DEFAULT 0,
    error_message TEXT,
    metadata TEXT,  -- JSON with additional context
    
    FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE,
    CONSTRAINT chk_positive_duration CHECK(duration_seconds IS NULL OR duration_seconds >= 0)
);

CREATE INDEX idx_agent_runs_dataset_id ON agent_runs(dataset_id);
CREATE INDEX idx_agent_runs_status ON agent_runs(status);
CREATE INDEX idx_agent_runs_started_at ON agent_runs(started_at);
CREATE INDEX idx_agent_runs_completed_at ON agent_runs(completed_at);
```

**Fields**:
- `id`: Unique identifier
- `dataset_id`: FK to datasets
- `status`: Current execution status
- `started_at`: When agent started
- `completed_at`: When agent finished
- `duration_seconds`: Total execution time
- `total_tables_processed`: Count of processed tables
- `total_columns_processed`: Count of processed columns
- `total_metadata_generated`: Count of metadata records created
- `error_message`: Error details if failed
- `metadata`: JSON with execution details (plan, strategy, etc.)

**Metadata Format**:
```json
{
  "total_gemini_calls": 42,
  "total_tokens_used": 12500,
  "plan": "sequential_tables",
  "batch_size": 10,
  "completion_percentage": 100
}
```

---

### 7. AGENT_LOGS Table

**Purpose**: Store detailed agent execution logs for debugging and monitoring

```sql
CREATE TABLE agent_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_run_id INTEGER NOT NULL,
    log_level VARCHAR(10) NOT NULL CHECK(log_level IN ('DEBUG', 'INFO', 'WARNING', 'ERROR')) DEFAULT 'INFO',
    message TEXT NOT NULL,
    context TEXT,  -- JSON with contextual information
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (agent_run_id) REFERENCES agent_runs(id) ON DELETE CASCADE
);

CREATE INDEX idx_agent_logs_agent_run_id ON agent_logs(agent_run_id);
CREATE INDEX idx_agent_logs_log_level ON agent_logs(log_level);
CREATE INDEX idx_agent_logs_timestamp ON agent_logs(timestamp);
CREATE FULLTEXT INDEX idx_agent_logs_fts ON agent_logs(message);
```

**Fields**:
- `id`: Unique identifier
- `agent_run_id`: FK to agent_runs
- `log_level`: Log severity (DEBUG, INFO, WARNING, ERROR)
- `message`: Log message
- `context`: JSON with context (current table, column, step, etc.)
- `timestamp`: When log was created

**Context Format**:
```json
{
  "current_table": "customers",
  "current_column": "customer_id",
  "step": "GEMINI_CALL",
  "gemini_tokens": 245,
  "retry_count": 0
}
```

---

### 8. AUDIT_LOGS Table

**Purpose**: Track all system changes for compliance and debugging

```sql
CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action VARCHAR(50) NOT NULL,  -- CREATE, UPDATE, DELETE, GENERATE, SEARCH
    entity_type VARCHAR(50) NOT NULL,  -- Dataset, Table, Column, Metadata
    entity_id INTEGER NOT NULL,
    user_id VARCHAR(100) DEFAULT 'system',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT,  -- JSON with change details
    
    CONSTRAINT audit_unique UNIQUE(timestamp, action, entity_type, entity_id)
);

CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
```

**Fields**:
- `id`: Unique identifier
- `action`: Action type
- `entity_type`: Type of entity affected
- `entity_id`: ID of affected entity
- `user_id`: User who performed action
- `timestamp`: When action occurred
- `details`: JSON with change details

**Details Format**:
```json
{
  "old_value": "draft",
  "new_value": "published",
  "changed_fields": ["status"],
  "source": "agent_run_12"
}
```

---

## Indexing Strategy

### Performance Indexes

| Table | Index | Purpose | Type |
|-------|-------|---------|------|
| datasets | idx_datasets_created_at | Timeline queries | B-tree |
| datasets | idx_datasets_metadata_generated | Filter processing status | B-tree |
| datasets | idx_datasets_fts | Full-text search | FTS5 |
| tables | idx_tables_dataset_id | Relationship queries | B-tree |
| tables | idx_tables_metadata_generated | Filter unprocessed | B-tree |
| columns | idx_columns_table_id | Relationship queries | B-tree |
| columns | idx_columns_fts | Search columns by name | FTS5 |
| metadata | idx_metadata_business_category | Filter by category | B-tree |
| metadata | idx_metadata_sensitivity_level | Security filtering | B-tree |
| metadata | idx_metadata_fts | Semantic search prep | FTS5 |
| agent_runs | idx_agent_runs_status | Monitor running tasks | B-tree |
| agent_runs | idx_agent_runs_started_at | Time-range queries | B-tree |
| agent_logs | idx_agent_logs_log_level | Filter warnings/errors | B-tree |
| audit_logs | idx_audit_logs_timestamp | Audit trails | B-tree |

### Query Optimization

```sql
-- Fast dataset lookup
SELECT * FROM datasets 
WHERE metadata_generated = 0 
LIMIT 10;
-- Uses: idx_datasets_metadata_generated

-- Timeline queries
SELECT d.*, COUNT(t.id) as table_count
FROM datasets d
LEFT JOIN tables t ON d.id = t.dataset_id
WHERE d.created_at > datetime('now', '-7 days')
GROUP BY d.id;
-- Uses: idx_datasets_created_at

-- Semantic search prep
SELECT c.*, m.embedding
FROM columns c
JOIN metadata m ON c.id = m.column_id
WHERE m.business_category = 'Customer'
LIMIT 100;
-- Uses: idx_metadata_business_category

-- Full-text search
SELECT * FROM metadata
WHERE metadata FTS match 'customer AND (id OR key)'
LIMIT 20;
-- Uses: idx_metadata_fts
```

---

## Data Integrity Constraints

### Foreign Key Constraints
- ✓ Cascading deletes: Dataset → Tables → Columns → Metadata
- ✓ Referential integrity: No orphaned records
- ✓ Enforced relationships: No invalid foreign keys

### Check Constraints
- ✓ Positive file sizes: `file_size_bytes > 0`
- ✓ Valid data types: Enum check on source_type, data_type, status
- ✓ Confidence scores: 0 ≤ confidence ≤ 1
- ✓ Sensitivity levels: Only Public, Internal, Confidential
- ✓ Relationship constraints: source_column ≠ target_column

### Unique Constraints
- ✓ Dataset names: Unique across system
- ✓ Table names: Unique per dataset
- ✓ Column names: Unique per table
- ✓ Metadata per column: 1:1 relationship

---

## Vector Store Schema (FAISS)

### Index Structure

```
FAISS Index
├─ Vector Dimension: 768 (Gemini Embedding)
├─ Index Type: IVFFlat (for fast search)
├─ Number of Clusters: 100
├─ Metric: Cosine Similarity
├─ Total Vectors: (number of columns)
└─ Metadata Mapping:
    ├─ Vector ID → Column ID
    ├─ Vector ID → Dataset ID
    └─ Vector ID → Embedding Timestamp
```

### Search Query Example

```python
# Query embedding: "customer information" (768 dims)
query_embedding = gemini_service.generate_embedding("customer information")

# Search FAISS index
distances, indices = faiss_index.search(
    np.array([query_embedding]), 
    k=10  # Return top 10
)

# Retrieve metadata
results = []
for idx, distance in zip(indices[0], distances[0]):
    column_id = vector_id_to_column_mapping[idx]
    column = db.query(Column).filter(Column.id == column_id).first()
    metadata = db.query(Metadata).filter(Metadata.column_id == column_id).first()
    results.append({
        "column": column,
        "metadata": metadata,
        "similarity_score": 1 - (distance / 2),  # Convert distance to similarity
    })
```

---

## Database Initialization

### SQLAlchemy Model Example

```python
from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ForeignKey, Float, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime

class Dataset(Base):
    __tablename__ = "datasets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text)
    source_type = Column(String(20), nullable=False)
    file_path = Column(String(512), unique=True, nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    row_count = Column(Integer)
    metadata_generated = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tables = relationship("Table", back_populates="dataset", cascade="all, delete-orphan")
    agent_runs = relationship("AgentRun", back_populates="dataset", cascade="all, delete-orphan")
    
    __table_args__ = (
        CheckConstraint('source_type IN ("CSV", "JSON", "SQLite")', name='chk_source_type'),
        CheckConstraint('file_size_bytes > 0', name='chk_positive_size'),
    )
```

---

## Migration Strategy

### Phase 1: Initial Setup
1. Create all tables with constraints
2. Create indexes
3. Initialize FAISS index

### Phase 2: Data Loading
1. Insert sample datasets
2. Extract and insert tables
3. Extract and insert columns
4. Generate and insert metadata

### Phase 3: Verification
1. Verify referential integrity
2. Test query performance
3. Validate index effectiveness

---

## Performance Targets

| Operation | Target | Method |
|-----------|--------|--------|
| Insert column | < 10ms | Batch insert, indexed foreign keys |
| Insert metadata | < 50ms | Single insert with embedding BLOB |
| Search by category | < 100ms | Category index |
| Full-text search | < 200ms | FTS5 index |
| Semantic search (FAISS) | < 500ms | In-memory index, 768-dim vectors |
| Agent run completion | < 2s/column | Async Gemini calls, batched inserts |

---

**✓ STEP 2: Database Schema Complete**

**Ready for STEP 3: API Contracts**
