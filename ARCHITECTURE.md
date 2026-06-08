# AI Data Catalog Builder - Architecture Document

## System Overview

The AI Data Catalog Builder is a production-ready application that automatically discovers, analyzes, and catalogs datasets using AI-powered metadata generation. It features a sophisticated agent-based architecture with MCP (Model Context Protocol) integration.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React + TypeScript)            │
│  Dashboard | Upload | Catalog | Search | Agent Monitor | MCP    │
└────────────────────┬────────────────────────────────────────────┘
                     │ REST API + WebSocket
┌────────────────────▼────────────────────────────────────────────┐
│                  Backend (FastAPI + Python)                     │
├──────────────────────────────────────────────────────────────────┤
│  API Layer                                                       │
│  ├─ Upload Routes                                               │
│  ├─ Catalog Routes                                              │
│  ├─ Search Routes                                               │
│  ├─ Agent Routes                                                │
│  └─ Dashboard Routes                                            │
├──────────────────────────────────────────────────────────────────┤
│  Agent Engine (Autonomous Loop)                                 │
│  ├─ Catalog Agent (Orchestrator)                                │
│  ├─ Planner (Decision Making)                                   │
│  ├─ Executor (Action Execution)                                 │
│  ├─ Memory (State Management)                                   │
│  ├─ Tools (Dataset Processing)                                  │
│  └─ Agent Logger (Execution Tracking)                           │
├──────────────────────────────────────────────────────────────────┤
│  MCP Server                                                      │
│  ├─ search_catalog()                                            │
│  ├─ list_datasets()                                             │
│  ├─ list_tables()                                               │
│  ├─ get_table_schema()                                          │
│  ├─ get_column_details()                                        │
│  └─ generate_metadata()                                         │
├──────────────────────────────────────────────────────────────────┤
│  Services Layer                                                  │
│  ├─ Gemini Service (LLM Integration)                            │
│  ├─ File Parser Service (CSV, JSON, SQLite)                     │
│  ├─ Vector Search Service (FAISS)                               │
│  ├─ Metadata Service                                            │
│  └─ Audit Service                                               │
├──────────────────────────────────────────────────────────────────┤
│  Data Access Layer (SQLAlchemy ORM)                             │
│  ├─ Dataset Model                                               │
│  ├─ Table Model                                                 │
│  ├─ Column Model                                                │
│  ├─ Metadata Model                                              │
│  ├─ Relationship Model                                          │
│  ├─ Agent Run Model                                             │
│  ├─ Agent Log Model                                             │
│  └─ Audit Log Model                                             │
└────────────────────┬────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────────┐
│              Data Storage Layer                                  │
├──────────────────────────────────────────────────────────────────┤
│  SQLite Database                                                │
│  ├─ Structured Data (Tables, Columns, Metadata)                │
│  └─ Audit & Logs                                               │
│                                                                 │
│  Vector Store (FAISS)                                          │
│  ├─ Column Embeddings                                          │
│  └─ Semantic Search Index                                      │
│                                                                 │
│  File Storage                                                  │
│  ├─ Uploaded Datasets                                          │
│  └─ Processing Cache                                           │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Frontend Architecture (React + TypeScript)

**Purpose**: User interface for dataset upload, exploration, and interaction with the AI Agent.

**Pages**:
- **Dashboard**: Overview with metrics and recent activity
- **Upload Dataset**: File upload with validation and progress tracking
- **Catalog Explorer**: Browse datasets, tables, and columns
- **Search**: Keyword and semantic search with filters
- **Dataset Details**: Detailed view of dataset structure and metadata
- **Agent Monitor**: Real-time visualization of agent execution
- **MCP Playground**: Interactive testing of MCP tools
- **Settings**: Configuration and preferences

**Technologies**:
- React 18+ with TypeScript
- Vite (Fast build tool)
- React Query (Data fetching & caching)
- Axios (HTTP client)
- Tailwind CSS (Styling)
- ShadCN UI (Component library)
- zustand (State management)
- Socket.io-client (WebSocket for real-time updates)

### 2. Backend Architecture (FastAPI + Python)

**Purpose**: API server, data processing, AI agent orchestration, and MCP server.

#### A. API Layer
RESTful endpoints organized by domain:
- `/api/upload/*` - File upload and validation
- `/api/datasets/*` - Dataset CRUD operations
- `/api/tables/*` - Table management
- `/api/columns/*` - Column information
- `/api/metadata/*` - Metadata operations
- `/api/search/*` - Search functionality
- `/api/agent/*` - Agent control and monitoring
- `/api/dashboard/*` - Dashboard metrics
- `/api/mcp/*` - MCP server endpoints

#### B. Agent Engine (Core AI Component)

**Agentic Workflow**:
```
SCAN (Load Dataset)
  ↓
ANALYZE (Extract Structure)
  ↓
PLAN (Determine Processing Strategy)
  ↓
TOOL CALL (Extract Metadata)
  ↓
GEMINI CALL (Generate Business Metadata)
  ↓
VALIDATE (Check Quality)
  ↓
STORE (Save to Database)
  ↓
REPEAT (Next Dataset/Table)
```

**Components**:
- `catalog_agent.py` - Main orchestrator
- `planner.py` - Decision making and strategy
- `executor.py` - Tool execution
- `memory.py` - State management
- `tools.py` - Dataset processing tools
- `agent_logger.py` - Execution tracking

#### C. MCP Server

**Purpose**: Expose catalog functionality to external AI systems.

**Tools**:
1. `search_catalog(query, type)` - Semantic search
2. `list_datasets()` - List all datasets
3. `list_tables(dataset_id)` - List tables in dataset
4. `get_table_schema(table_id)` - Get table structure
5. `get_column_details(column_id)` - Get column information
6. `generate_metadata(column_id)` - Trigger metadata generation

#### D. Services Layer

**Gemini Service**:
- LLM calls for metadata generation
- Embedding generation for semantic search
- Retry logic and error handling
- Configurable prompts
- Token management

**File Parser Service**:
- CSV parsing and validation
- JSON parsing and flattening
- SQLite database extraction
- Schema detection
- Sample value extraction

**Vector Search Service**:
- FAISS index management
- Semantic search execution
- Embedding storage and retrieval
- Index persistence

**Metadata Service**:
- Metadata CRUD operations
- Relationship tracking
- Validation and enrichment

**Audit Service**:
- Action logging
- Change tracking
- User attribution

#### E. Data Access Layer (SQLAlchemy)

**Models**:
- Dataset
- Table
- Column
- Metadata
- Relationship
- AgentRun
- AgentLog
- AuditLog

### 3. Database Architecture

**SQLite Database**:
- Lightweight and serverless
- No external dependency
- File-based (easy to distribute)
- Suitable for AI Prototype Challenge
- Supports full-text search

**Tables**:
```
datasets
├─ id (PK)
├─ name
├─ description
├─ source_type (CSV, JSON, SQLite)
├─ file_path
├─ row_count
├─ created_at
└─ metadata_generated (boolean)

tables
├─ id (PK)
├─ dataset_id (FK)
├─ name
├─ row_count
├─ description
├─ metadata_generated
└─ created_at

columns
├─ id (PK)
├─ table_id (FK)
├─ name
├─ data_type (String, Integer, Float, Boolean, Date)
├─ nullable
├─ sample_values (JSON)
├─ metadata_generated
└─ created_at

metadata
├─ id (PK)
├─ column_id (FK)
├─ business_description
├─ business_category
├─ tags (JSON)
├─ sensitivity_level (Public, Internal, Confidential)
├─ embedding (BLOB)
├─ generated_at
└─ generated_by

relationships
├─ id (PK)
├─ source_column_id (FK)
├─ target_column_id (FK)
├─ relationship_type
└─ confidence

agent_runs
├─ id (PK)
├─ dataset_id (FK)
├─ status (Running, Completed, Failed)
├─ started_at
├─ completed_at
└─ metadata (JSON)

agent_logs
├─ id (PK)
├─ agent_run_id (FK)
├─ log_level (INFO, WARNING, ERROR, DEBUG)
├─ message
├─ timestamp
└─ context (JSON)

audit_logs
├─ id (PK)
├─ action
├─ entity_type
├─ entity_id
├─ user
├─ timestamp
└─ details (JSON)
```

### 4. AI Integration Strategy

**Gemini 2.5 Flash**:
- Fast and efficient for metadata generation
- Used for column description generation
- Embedding generation for semantic search
- Agentic reasoning with function calling

**Prompts**:
```
System Prompt:
"You are an expert data catalog specialist. Analyze column metadata and generate business-friendly descriptions."

User Prompt:
"Column: {column_name}
Datatype: {data_type}
Sample Values: {sample_values}

Generate JSON with:
- business_description: Clear business meaning (1-2 sentences)
- business_category: Category (e.g., Customer, Financial, Location)
- tags: List of relevant tags (max 5)
- sensitivity_level: Public, Internal, or Confidential"
```

### 5. Search Architecture

**Dual Search Strategy**:

1. **Keyword Search**:
   - SQLite full-text search
   - Fast, exact matches
   - Index on table/column names and descriptions
   - Case-insensitive

2. **Semantic Search**:
   - Gemini Embeddings API
   - FAISS vector index
   - Contextual understanding
   - Example: "customer information" matches customer_id, customer_name, customer_status

**Search Index**:
- Column embeddings stored in metadata table
- FAISS index persisted to disk
- Reindexed on metadata updates
- Dimension: 768 (Gemini embedding size)

## Data Flow

### Upload & Processing Flow

```
1. User uploads CSV/JSON/SQLite
2. File validation (size, format, permissions)
3. Agent triggered via async task
4. Agent SCANS file structure
5. Agent ANALYZES and extracts:
   - Tables/collections
   - Columns/fields
   - Data types
   - Sample values (first 5 rows)
6. Agent PLANS metadata generation strategy
7. Agent TOOL CALLS to extract metadata
8. Agent CALLS Gemini for business metadata
9. Agent VALIDATES output quality
10. Agent STORES in database
11. Agent generates embeddings
12. FAISS index updated
13. Frontend receives WebSocket updates
14. Dashboard reflects new data
15. Audit log entry created
```

### Search Flow

```
1. User enters search query
2. Search service receives query
3. If semantic:
   - Generate embedding via Gemini API
   - Search FAISS index for similar embeddings
   - Retrieve column/table metadata
4. If keyword:
   - Execute FTS query on database
5. Combine and rank results
6. Return to frontend with metadata
7. Frontend displays results with highlights
```

### Agent Execution Flow

```
1. API receives /api/agent/run request
2. Creates AgentRun record
3. Spawns async agent executor task
4. Agent enters loop:
   - Retrieve current dataset/table
   - Check memory for state
   - Plan next steps (planner.py)
   - Execute tools (executor.py)
   - Call Gemini for metadata
   - Validate results
   - Store results
   - Log progress (agent_logger.py)
   - Update WebSocket with progress
5. Loop continues until all data processed
6. Mark AgentRun as complete
7. Update dashboard metrics
8. Create audit log
```

## Technology Decisions

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React + TypeScript | Industry standard, excellent tooling, large ecosystem |
| **Backend** | FastAPI | Modern, fast, auto-documentation, async support |
| **Database** | SQLite | Serverless, portable, sufficient for challenge scope |
| **ORM** | SQLAlchemy | Mature, flexible, excellent relationships support |
| **Validation** | Pydantic | Type safety, automatic validation, serialization |
| **LLM** | Gemini 2.5 Flash | Fast, efficient, free tier available, good accuracy |
| **Vector Search** | FAISS | High-performance, lightweight, no external service |
| **API Style** | REST + WebSocket | WebSocket for real-time agent monitoring |
| **Testing** | Pytest + Vitest | Comprehensive, fast, modern frameworks |
| **Styling** | Tailwind + ShadCN | Professional, responsive, component-rich |
| **Real-time** | Socket.io | Reliable WebSocket with fallbacks |

## Non-Functional Requirements

| Requirement | Target | Implementation |
|-------------|--------|-----------------|
| **Performance** | <2s metadata generation per column | Gemini streaming, batch processing |
| **Scalability** | Handle 100+ tables | Async processing, agent batching |
| **Reliability** | 99.9% uptime during demo | Error handling, retry logic, circuit breakers |
| **Security** | Sensitive data flagging | Sensitivity levels in metadata |
| **Usability** | Judges understand within 5 min | Clear UI, excellent documentation |
| **Code Quality** | Production-ready | SOLID principles, type safety, 80%+ test coverage |
| **Responsiveness** | Real-time agent updates | WebSocket connections, min latency |

## Evaluation Criteria Alignment

| Criteria | Implementation | Status |
|----------|-----------------|--------|
| **AI Agent Development** | Real agentic workflow (SCAN→ANALYZE→PLAN→EXECUTE) with memory and autonomous decision making | ✓ |
| **MCP Implementation** | Full MCP server with 6 tools and interactive playground | ✓ |
| **API Integration** | RESTful API + Gemini API + WebSocket integration | ✓ |
| **End-to-End Product** | Complete workflow from upload to searchable catalog | ✓ |
| **Usability** | Professional SaaS UI with responsive design and real-time feedback | ✓ |
| **Code Quality** | Type-safe, SOLID principles, comprehensive tests | ✓ |
| **Documentation** | Architecture, API, MCP guide, sample data included | ✓ |

---

## Next Steps

This architecture supports:
- ✓ Autonomous agent-based metadata generation
- ✓ Real-time monitoring and logging
- ✓ Multi-format dataset support (CSV, JSON, SQLite)
- ✓ Semantic and keyword search
- ✓ MCP tool exposure
- ✓ Professional, judge-ready UI

**Ready for STEP 2: Database Schema & ER Diagram**
