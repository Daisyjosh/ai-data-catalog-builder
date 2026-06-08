# AI Data Catalog Builder - Project Folder Structure

## Complete Directory Layout

```
ai-data-catalog-builder/
│
├── README.md                          # Project overview
├── ARCHITECTURE.md                    # System architecture
├── DATABASE_SCHEMA.md                 # Database schema & ER diagram
├── API_CONTRACTS.md                   # API specifications
├── MCP_ARCHITECTURE.md                # MCP server documentation
├── AGENT_ARCHITECTURE.md              # Agent implementation details
├── PROJECT_STRUCTURE.md               # This file
├── .gitignore                         # Git ignore rules
├── .env.example                       # Environment variables template
├── requirements.txt                   # Python dependencies
├── package.json                       # Node.js dependencies
├── tsconfig.json                      # TypeScript configuration
├── vite.config.ts                     # Vite configuration
│
├── backend/                           # Python FastAPI Backend
│   ├── __init__.py
│   ├── main.py                        # FastAPI application entry point
│   ├── config.py                      # Configuration management
│   ├── settings.py                    # Environment settings
│   │
│   ├── models/                        # SQLAlchemy ORM Models
│   │   ├── __init__.py
│   │   ├── dataset.py                 # Dataset model
│   │   ├── table.py                   # Table model
│   │   ├── column.py                  # Column model
│   │   ├── metadata.py                # Metadata model
│   │   ├── relationship.py            # Relationship model
│   │   ├── agent_run.py               # Agent run tracking
│   │   ├── agent_log.py               # Agent logging
│   │   └── audit_log.py               # Audit logging
│   │
│   ├── schemas/                       # Pydantic Request/Response Models
│   │   ├── __init__.py
│   │   ├── dataset.py                 # Dataset schemas
│   │   ├── table.py                   # Table schemas
│   │   ├── column.py                  # Column schemas
│   │   ├── metadata.py                # Metadata schemas
│   │   ├── search.py                  # Search schemas
│   │   ├── agent.py                   # Agent schemas
│   │   ├── error.py                   # Error schemas
│   │   └── dashboard.py               # Dashboard schemas
│   │
│   ├── routes/                        # API Routes
│   │   ├── __init__.py
│   │   ├── datasets.py                # /datasets endpoints
│   │   ├── tables.py                  # /tables endpoints
│   │   ├── columns.py                 # /columns endpoints
│   │   ├── metadata.py                # /metadata endpoints
│   │   ├── search.py                  # /search endpoints
│   │   ├── agent.py                   # /agent endpoints
│   │   ├── dashboard.py               # /dashboard endpoints
│   │   └── health.py                  # /health endpoint
│   │
│   ├── services/                      # Business Logic Services
│   │   ├── __init__.py
│   │   ├── gemini_service.py          # Gemini API integration
│   │   ├── file_parser_service.py     # CSV/JSON/SQLite parsing
│   │   ├── vector_search_service.py   # FAISS vector search
│   │   ├── metadata_service.py        # Metadata operations
│   │   ├── audit_service.py           # Audit logging
│   │   └── storage_service.py         # File storage management
│   │
│   ├── agent/                         # AI Agent Implementation
│   │   ├── __init__.py
│   │   ├── catalog_agent.py           # Main agent orchestrator
│   │   ├── planner.py                 # Planning and strategy
│   │   ├── executor.py                # Tool execution
│   │   ├── memory.py                  # State management
│   │   ├── tools.py                   # Data extraction tools
│   │   └── agent_logger.py            # Execution logging
│   │
│   ├── mcp/                           # MCP Server Implementation
│   │   ├── __init__.py
│   │   ├── server.py                  # MCP FastAPI endpoints
│   │   ├── tools.py                   # MCP tool implementations
│   │   └── schemas.py                 # MCP request/response schemas
│   │
│   ├── database/                      # Database Configuration
│   │   ├── __init__.py
│   │   ├── base.py                    # Database connection
│   │   ├── session.py                 # Session management
│   │   └── init_db.py                 # Database initialization
│   │
│   ├── middleware/                    # Custom Middleware
│   │   ├── __init__.py
│   │   ├── error_handler.py           # Global error handling
│   │   ├── logging.py                 # Request/response logging
│   │   ├── cors.py                    # CORS configuration
│   │   └── auth.py                    # Authentication (optional)
│   │
│   ├── utils/                         # Utility Functions
│   │   ├── __init__.py
│   │   ├── validators.py              # Data validation helpers
│   │   ├── formatters.py              # Response formatting
│   │   ├── file_utils.py              # File operations
│   │   └── constants.py               # Application constants
│   │
│   ├── uploads/                       # Uploaded datasets (gitignored)
│   │   └── .gitkeep
│   │
│   └── logs/                          # Application logs (gitignored)
│       └── .gitkeep
│
├── frontend/                          # React TypeScript Frontend
│   ├── index.html                     # HTML entry point
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── tailwind.config.js             # Tailwind CSS config
│   ├── postcss.config.js              # PostCSS config
│   │
│   ├── src/
│   │   ├── main.tsx                   # React entry point
│   │   ├── App.tsx                    # Root component
│   │   ├── app.css                    # Global styles
│   │   │
│   │   ├── pages/                     # Page Components
│   │   │   ├── Dashboard.tsx          # Dashboard page
│   │   │   ├── UploadDataset.tsx      # Upload page
│   │   │   ├── CatalogExplorer.tsx    # Catalog explorer page
│   │   │   ├── Search.tsx             # Search page
│   │   │   ├── DatasetDetails.tsx     # Dataset details page
│   │   │   ├── AgentMonitor.tsx       # Agent monitoring page
│   │   │   ├── MCPPlayground.tsx      # MCP testing page
│   │   │   └── Settings.tsx           # Settings page
│   │   │
│   │   ├── components/                # Reusable Components
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   │   │   ├── Header.tsx         # Page header
│   │   │   │   ├── Footer.tsx         # Page footer
│   │   │   │   └── Layout.tsx         # Main layout wrapper
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── LoadingSpinner.tsx # Loading indicator
│   │   │   │   ├── ErrorAlert.tsx     # Error message
│   │   │   │   ├── SuccessToast.tsx   # Success notification
│   │   │   │   ├── Card.tsx           # Card component
│   │   │   │   ├── Button.tsx         # Button component
│   │   │   │   ├── Modal.tsx          # Modal component
│   │   │   │   └── Badge.tsx          # Badge component
│   │   │   │
│   │   │   ├── dataset/
│   │   │   │   ├── DatasetCard.tsx    # Dataset card
│   │   │   │   ├── DatasetList.tsx    # Dataset list
│   │   │   │   ├── DatasetForm.tsx    # Dataset form
│   │   │   │   └── UploadProgress.tsx # Upload progress
│   │   │   │
│   │   │   ├── agent/
│   │   │   │   ├── AgentProgress.tsx  # Progress indicator
│   │   │   │   ├── AgentLogs.tsx      # Log viewer
│   │   │   │   ├── ExecutionTimeline.tsx # Execution timeline
│   │   │   │   └── AgentStatus.tsx    # Status indicator
│   │   │   │
│   │   │   ├── search/
│   │   │   │   ├── SearchBar.tsx      # Search input
│   │   │   │   ├── SearchResults.tsx  # Results display
│   │   │   │   └── SearchFilters.tsx  # Filter options
│   │   │   │
│   │   │   └── mcp/
│   │   │       ├── ToolSelector.tsx   # Tool selection
│   │   │       ├── ParameterInput.tsx # Parameter editor
│   │   │       └── ResponseViewer.tsx # Response display
│   │   │
│   │   ├── hooks/                     # Custom React Hooks
│   │   │   ├── useDatasets.ts         # Datasets hook
│   │   │   ├── useAgent.ts            # Agent monitoring hook
│   │   │   ├── useSearch.ts           # Search hook
│   │   │   ├── useMCP.ts              # MCP tools hook
│   │   │   ├── useWebSocket.ts        # WebSocket hook
│   │   │   └── useDarkMode.ts         # Dark mode hook
│   │   │
│   │   ├── services/                  # API Services
│   │   │   ├── api.ts                 # API client configuration
│   │   │   ├── datasetService.ts      # Dataset API calls
│   │   │   ├── searchService.ts       # Search API calls
│   │   │   ├── agentService.ts        # Agent API calls
│   │   │   ├── mcpService.ts          # MCP API calls
│   │   │   └── dashboardService.ts    # Dashboard API calls
│   │   │
│   │   ├── store/                     # State Management (Zustand)
│   │   │   ├── datasetStore.ts        # Dataset state
│   │   │   ├── agentStore.ts          # Agent state
│   │   │   ├── uiStore.ts             # UI state
│   │   │   └── searchStore.ts         # Search state
│   │   │
│   │   ├── types/                     # TypeScript Types & Interfaces
│   │   │   ├── index.ts               # Type exports
│   │   │   ├── dataset.ts             # Dataset types
│   │   │   ├── metadata.ts            # Metadata types
│   │   │   ├── agent.ts               # Agent types
│   │   │   ├── api.ts                 # API types
│   │   │   └── mcp.ts                 # MCP types
│   │   │
│   │   ├── utils/                     # Utility Functions
│   │   │   ├── api.ts                 # API helpers
│   │   │   ├── format.ts              # Formatting helpers
│   │   │   ├── validation.ts          # Form validation
│   │   │   ├── date.ts                # Date utilities
│   │   │   └── constants.ts           # Frontend constants
│   │   │
│   │   └── styles/                    # Global Styles
│   │       ├── globals.css            # Global CSS
│   │       ├── variables.css          # CSS variables
│   │       └── theme.css              # Theme configuration
│   │
│   └── public/                        # Static Assets
│       ├── logo.svg                   # Application logo
│       ├── favicon.ico                # Favicon
│       └── images/                    # Images
│
├── tests/                             # Test Suite
│   ├── conftest.py                    # Pytest configuration
│   ├── pytest.ini                     # Pytest settings
│   │
│   ├── backend/
│   │   ├── __init__.py
│   │   ├── test_models.py             # Model tests
│   │   ├── test_schemas.py            # Schema validation tests
│   │   │
│   │   ├── routes/
│   │   │   ├── test_datasets.py       # Dataset routes tests
│   │   │   ├── test_tables.py         # Table routes tests
│   │   │   ├── test_search.py         # Search routes tests
│   │   │   └── test_agent.py          # Agent routes tests
│   │   │
│   │   ├── services/
│   │   │   ├── test_gemini_service.py # Gemini service tests
│   │   │   ├── test_file_parser.py    # File parser tests
│   │   │   └── test_vector_search.py  # Vector search tests
│   │   │
│   │   └── agent/
│   │       ├── test_catalog_agent.py  # Agent tests
│   │       ├── test_planner.py        # Planner tests
│   │       ├── test_executor.py       # Executor tests
│   │       └── test_tools.py          # Tools tests
│   │
│   ├── frontend/
│   │   ├── setup.ts                   # Test setup
│   │   ├── components/
│   │   │   └── Button.test.tsx        # Component tests
│   │   ├── hooks/
│   │   │   └── useDatasets.test.ts    # Hook tests
│   │   └── services/
│   │       └── api.test.ts            # API service tests
│   │
│   └── integration/
│       ├── test_upload_workflow.py    # End-to-end upload test
│       ├── test_search_workflow.py    # End-to-end search test
│       └── test_agent_workflow.py     # End-to-end agent test
│
├── docs/                              # Documentation
│   ├── GETTING_STARTED.md             # Quick start guide
│   ├── INSTALLATION.md                # Installation instructions
│   ├── DEPLOYMENT.md                  # Deployment guide
│   ├── API.md                         # API documentation
│   ├── MCP.md                         # MCP guide
│   ├── DEVELOPMENT.md                 # Development guide
│   ├── TROUBLESHOOTING.md             # Troubleshooting guide
│   └── images/                        # Documentation images
│
├── sample_data/                       # Sample Datasets
│   ├── customers.csv                  # Customer sample data
│   ├── orders.csv                     # Orders sample data
│   ├── products.csv                   # Products sample data
│   ├── employees.csv                  # Employees sample data
│   ├── sales.csv                      # Sales sample data
│   ├── sample_database.db             # SQLite sample database
│   ├── sample.json                    # JSON sample data
│   └── README.md                      # Sample data documentation
│
├── scripts/                           # Utility Scripts
│   ├── init_db.py                     # Database initialization
│   ├── seed_data.py                   # Seed sample data
│   ├── generate_embeddings.py         # Pre-generate embeddings
│   ├── build_faiss_index.py           # Build FAISS index
│   ├── cleanup.sh                     # Cleanup script
│   └── demo.py                        # Demo script
│
├── docker/                            # Docker Configuration
│   ├── Dockerfile.backend             # Backend Docker image
│   ├── Dockerfile.frontend            # Frontend Docker image
│   └── docker-compose.yml             # Docker Compose config
│
├── .github/                           # GitHub Configuration
│   └── workflows/
│       ├── tests.yml                  # CI test workflow
│       ├── deploy.yml                 # CD deployment workflow
│       └── code-quality.yml           # Code quality checks
│
├── .vscode/                           # VS Code Configuration
│   ├── settings.json                  # Workspace settings
│   ├── extensions.json                # Recommended extensions
│   └── launch.json                    # Debug configuration
│
├── .dockerignore                      # Docker ignore rules
├── .gitignore                         # Git ignore rules
├── .env.example                       # Environment template
├── .env.local                         # Local environment (gitignored)
├── .env.test                          # Test environment
├── LICENSE                            # License file
└── CONTRIBUTING.md                    # Contribution guidelines
```

---

## Directory Descriptions

### `/backend`
FastAPI application containing all server-side logic.

**Key Modules**:
- `main.py`: FastAPI app initialization and route mounting
- `models/`: SQLAlchemy ORM models for database tables
- `schemas/`: Pydantic models for request/response validation
- `routes/`: API endpoint implementations
- `services/`: Business logic and external service integrations
- `agent/`: Autonomous agent implementation
- `mcp/`: MCP server for external integrations

### `/frontend`
React TypeScript SPA with modern UI/UX.

**Key Directories**:
- `pages/`: Full-page components for each route
- `components/`: Reusable UI components
- `hooks/`: Custom React hooks
- `services/`: API client functions
- `store/`: Zustand state management
- `types/`: TypeScript type definitions

### `/tests`
Comprehensive test suite with unit and integration tests.

**Structure**:
- `backend/`: Backend unit tests
- `frontend/`: Frontend component and hook tests
- `integration/`: End-to-end workflow tests

### `/docs`
Complete project documentation.

**Files**:
- `GETTING_STARTED.md`: Quick start guide for judges
- `API.md`: Complete API documentation
- `MCP.md`: MCP tools and usage guide
- `DEVELOPMENT.md`: Development setup and workflow

### `/sample_data`
Pre-built sample datasets for demonstration.

**Includes**:
- CSV files (customers, orders, products, etc.)
- SQLite database with sample schema
- JSON sample data
- README with data descriptions

---

## File Naming Conventions

### Python Files
- `models/dataset.py` - Singular model names
- `services/gemini_service.py` - Service suffix
- `routes/datasets.py` - Plural route names
- `test_dataset.py` - test_ prefix for tests

### TypeScript/React Files
- `pages/Dashboard.tsx` - PascalCase for components
- `hooks/useDatasets.ts` - camelCase with 'use' prefix for hooks
- `types/dataset.ts` - lowercase for type files
- `services/datasetService.ts` - camelCase service names
- `*.test.tsx` - test_ suffix for test files

### Configuration Files
- `.env` - Environment variables
- `config.py` - Configuration module
- `settings.py` - Settings module
- `vite.config.ts` - Tool configurations

---

## Database File Location

```
backend/
└── catalog.db          # SQLite database (created on init)
```

Environment variable: `DATABASE_URL=sqlite:///./backend/catalog.db`

---

## Uploads Directory

```
backend/
└── uploads/
    ├── dataset_1/
    │   ├── customers.csv
    │   └── metadata.json
    ├── dataset_2/
    │   └── products.json
    └── .gitkeep
```

---

## Logs Directory

```
backend/
└── logs/
    ├── app.log
    ├── agent.log
    └── error.log
```

---

## Environment Files

### `.env.example`
Template with all required environment variables.

### `.env.local`
Local development environment (gitignored).

### `.env.test`
Test environment configuration.

---

## Key Configuration Files

### `backend/config.py`
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./backend/catalog.db"
    
    # API
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    
    # Gemini
    GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-2.5-flash"
    
    # FAISS
    FAISS_INDEX_PATH: str = "./backend/faiss_index.bin"
    
    # Storage
    UPLOAD_DIR: str = "./backend/uploads"
    MAX_UPLOAD_SIZE: int = 100 * 1024 * 1024  # 100MB
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### `frontend/vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
```

### `backend/database/base.py`
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./backend/catalog.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
```

---

## Build Outputs

### Frontend Build
```
frontend/dist/           # Vite build output
├── index.html
├── assets/
│   ├── index-*.js
│   └── index-*.css
└── favicon.ico
```

### Backend
- No compilation needed (Python)
- Generated files: FAISS index, database file, logs

---

## Git Ignore Rules

### Key Ignored Directories
```
backend/uploads/        # User uploaded files
backend/logs/           # Application logs
backend/catalog.db      # SQLite database
backend/faiss_index.*   # Vector index
frontend/dist/          # Build output
frontend/node_modules/  # Dependencies
.env.local              # Local environment
__pycache__/            # Python cache
.pytest_cache/          # Test cache
.vscode/settings.json   # Personal IDE settings
```

---

## Quick Start with This Structure

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python scripts/init_db.py
python scripts/seed_data.py
python main.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Running Tests
```bash
# Backend tests
pytest tests/backend/

# Frontend tests
npm run test

# All tests with coverage
pytest --cov=backend tests/backend/
```

---

**✓ STEP 6: Folder Structure Complete**

Creating STEP 7: Backend Implementation...
