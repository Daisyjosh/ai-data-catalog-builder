# AI Data Catalog Builder - MCP Architecture & Implementation

## Model Context Protocol (MCP) Overview

The MCP server exposes the AI Data Catalog as a set of tools that can be used by external AI systems, Claude, and other LLMs. This enables seamless integration with other AI workflows.

```
┌─────────────────────────────────────────────────────────────────┐
│                     External AI System                          │
│                    (Claude, GPT, Custom LLM)                    │
└────────────────────┬────────────────────────────────────────────┘
                     │ MCP Client Protocol
                     │ (JSON-RPC over stdio/HTTP)
┌────────────────────▼────────────────────────────────────────────┐
│              MCP Server (FastAPI)                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Tool Registry                                            │  │
│  │ ├─ search_catalog()                                      │  │
│  │ ├─ list_datasets()                                       │  │
│  │ ├─ list_tables()                                         │  │
│  │ ├─ get_table_schema()                                    │  │
│  │ ├─ get_column_details()                                  │  │
│  │ └─ generate_metadata()                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Tool Implementation Layer                                │  │
│  │ ├─ Database Queries                                      │  │
│  │ ├─ FAISS Vector Search                                   │  │
│  │ ├─ Validation & Error Handling                           │  │
│  │ └─ Response Formatting                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────────┐
│         Backend Services & Database                             │
│  ├─ SQLite Database                                             │
│  ├─ FAISS Vector Index                                          │
│  └─ Gemini API Integration                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## MCP Tool Definitions

### 1. search_catalog

**Purpose**: Semantic and keyword search across the entire catalog

**Schema**:
```json
{
  "name": "search_catalog",
  "description": "Search the catalog semantically or by keyword. Returns matching columns, tables, and datasets with their metadata.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Search query (e.g., 'customer information', 'payment transactions')",
        "minLength": 1,
        "maxLength": 500
      },
      "search_type": {
        "type": "string",
        "enum": ["semantic", "keyword"],
        "description": "Type of search: 'semantic' uses AI embeddings, 'keyword' uses text matching",
        "default": "semantic"
      },
      "limit": {
        "type": "integer",
        "description": "Maximum number of results to return",
        "minimum": 1,
        "maximum": 100,
        "default": 10
      },
      "filters": {
        "type": "object",
        "description": "Optional filters to narrow results",
        "properties": {
          "sensitivity_level": {
            "type": "string",
            "enum": ["Public", "Internal", "Confidential"],
            "description": "Filter by data sensitivity"
          },
          "business_category": {
            "type": "string",
            "description": "Filter by business category (e.g., 'Customer', 'Financial')"
          },
          "dataset_id": {
            "type": "integer",
            "description": "Limit search to specific dataset"
          }
        }
      }
    },
    "required": ["query"]
  }
}
```

**Implementation**:
```python
async def search_catalog(
    query: str,
    search_type: str = "semantic",
    limit: int = 10,
    filters: Optional[dict] = None
) -> dict:
    """
    Search catalog using semantic or keyword search.
    
    Args:
        query: Search query
        search_type: 'semantic' or 'keyword'
        limit: Max results
        filters: Optional filter dict
    
    Returns:
        Dictionary with search results
    """
    try:
        if search_type == "semantic":
            # Generate embedding for query
            query_embedding = await gemini_service.generate_embedding(query)
            
            # Search FAISS index
            results = faiss_service.search(query_embedding, limit)
            
        else:  # keyword search
            results = db.search_text(query, limit)
        
        # Apply filters
        if filters:
            results = apply_filters(results, filters)
        
        # Enrich results with metadata
        enriched_results = []
        for result in results:
            column = db.get_column(result['column_id'])
            metadata = db.get_metadata(result['column_id'])
            table = db.get_table(column.table_id)
            dataset = db.get_dataset(table.dataset_id)
            
            enriched_results.append({
                "column_id": column.id,
                "column_name": column.name,
                "table_name": table.name,
                "dataset_name": dataset.name,
                "data_type": column.data_type,
                "metadata": {
                    "business_description": metadata.business_description,
                    "business_category": metadata.business_category,
                    "tags": metadata.tags,
                    "sensitivity_level": metadata.sensitivity_level
                },
                "similarity_score": result.get('similarity_score')
            })
        
        return {
            "success": True,
            "query": query,
            "search_type": search_type,
            "total_results": len(enriched_results),
            "results": enriched_results
        }
    
    except Exception as e:
        logger.error(f"Search failed: {str(e)}")
        return {
            "success": False,
            "error": f"Search failed: {str(e)}"
        }
```

**Example Request**:
```json
{
  "name": "search_catalog",
  "arguments": {
    "query": "customer financial data",
    "search_type": "semantic",
    "limit": 5,
    "filters": {
      "sensitivity_level": "Internal"
    }
  }
}
```

**Example Response**:
```json
{
  "success": true,
  "query": "customer financial data",
  "search_type": "semantic",
  "total_results": 3,
  "results": [
    {
      "column_id": 42,
      "column_name": "customer_credit_limit",
      "table_name": "customers",
      "dataset_name": "sales_db",
      "data_type": "Float",
      "metadata": {
        "business_description": "Maximum credit amount authorized for customer",
        "business_category": "Financial",
        "tags": ["credit", "financial", "limit"],
        "sensitivity_level": "Internal"
      },
      "similarity_score": 0.94
    }
  ]
}
```

---

### 2. list_datasets

**Purpose**: List all available datasets with summary information

**Schema**:
```json
{
  "name": "list_datasets",
  "description": "List all datasets available in the catalog with metadata counts and processing status.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "limit": {
        "type": "integer",
        "description": "Maximum number of datasets to return",
        "minimum": 1,
        "maximum": 100,
        "default": 20
      },
      "offset": {
        "type": "integer",
        "description": "Number of datasets to skip",
        "minimum": 0,
        "default": 0
      },
      "filters": {
        "type": "object",
        "properties": {
          "metadata_generated": {
            "type": "boolean",
            "description": "Filter by metadata processing status"
          },
          "source_type": {
            "type": "string",
            "enum": ["CSV", "JSON", "SQLite"],
            "description": "Filter by file type"
          }
        }
      }
    }
  }
}
```

**Implementation**:
```python
async def list_datasets(
    limit: int = 20,
    offset: int = 0,
    filters: Optional[dict] = None
) -> dict:
    """
    List all datasets with metadata counts.
    
    Args:
        limit: Max results
        offset: Skip offset
        filters: Optional filters
    
    Returns:
        Dictionary with datasets list
    """
    try:
        # Build query
        query = db.query(Dataset)
        
        if filters:
            if 'metadata_generated' in filters:
                query = query.filter(Dataset.metadata_generated == filters['metadata_generated'])
            if 'source_type' in filters:
                query = query.filter(Dataset.source_type == filters['source_type'])
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        datasets = query.offset(offset).limit(limit).all()
        
        # Enrich with counts
        result_datasets = []
        for dataset in datasets:
            table_count = db.query(Table).filter(Table.dataset_id == dataset.id).count()
            column_count = db.query(Column).join(Table).filter(
                Table.dataset_id == dataset.id
            ).count()
            metadata_count = db.query(Metadata).join(Column).join(Table).filter(
                Table.dataset_id == dataset.id
            ).count()
            
            result_datasets.append({
                "id": dataset.id,
                "name": dataset.name,
                "description": dataset.description,
                "source_type": dataset.source_type,
                "file_size_bytes": dataset.file_size_bytes,
                "row_count": dataset.row_count,
                "metadata_generated": dataset.metadata_generated,
                "created_at": dataset.created_at.isoformat(),
                "updated_at": dataset.updated_at.isoformat(),
                "table_count": table_count,
                "column_count": column_count,
                "metadata_generated_count": metadata_count
            })
        
        return {
            "success": True,
            "total": total,
            "limit": limit,
            "offset": offset,
            "datasets": result_datasets
        }
    
    except Exception as e:
        logger.error(f"Failed to list datasets: {str(e)}")
        return {
            "success": False,
            "error": f"Failed to list datasets: {str(e)}"
        }
```

**Example Request**:
```json
{
  "name": "list_datasets",
  "arguments": {
    "limit": 10,
    "filters": {
      "metadata_generated": true
    }
  }
}
```

**Example Response**:
```json
{
  "success": true,
  "total": 12,
  "limit": 10,
  "offset": 0,
  "datasets": [
    {
      "id": 1,
      "name": "sales_db",
      "description": "Sales and transaction data",
      "source_type": "CSV",
      "file_size_bytes": 5242880,
      "row_count": 50000,
      "metadata_generated": true,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:35:00Z",
      "table_count": 5,
      "column_count": 42,
      "metadata_generated_count": 42
    }
  ]
}
```

---

### 3. list_tables

**Purpose**: List tables in a specific dataset

**Schema**:
```json
{
  "name": "list_tables",
  "description": "List all tables in a specific dataset with their schemas and metadata status.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "dataset_id": {
        "type": "integer",
        "description": "The ID of the dataset"
      },
      "limit": {
        "type": "integer",
        "description": "Maximum number of tables to return",
        "minimum": 1,
        "maximum": 100,
        "default": 20
      },
      "offset": {
        "type": "integer",
        "description": "Number of tables to skip",
        "minimum": 0,
        "default": 0
      }
    },
    "required": ["dataset_id"]
  }
}
```

**Implementation**:
```python
async def list_tables(
    dataset_id: int,
    limit: int = 20,
    offset: int = 0
) -> dict:
    """
    List tables in a dataset.
    
    Args:
        dataset_id: ID of dataset
        limit: Max results
        offset: Skip offset
    
    Returns:
        Dictionary with tables list
    """
    try:
        # Verify dataset exists
        dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
        if not dataset:
            return {
                "success": False,
                "error": f"Dataset {dataset_id} not found"
            }
        
        # Get tables
        query = db.query(Table).filter(Table.dataset_id == dataset_id)
        total = query.count()
        tables = query.offset(offset).limit(limit).all()
        
        # Enrich with column counts
        result_tables = []
        for table in tables:
            column_count = db.query(Column).filter(Column.table_id == table.id).count()
            metadata_count = db.query(Metadata).join(Column).filter(
                Column.table_id == table.id
            ).count()
            
            result_tables.append({
                "id": table.id,
                "dataset_id": table.dataset_id,
                "name": table.name,
                "row_count": table.row_count,
                "description": table.description,
                "metadata_generated": table.metadata_generated,
                "created_at": table.created_at.isoformat(),
                "updated_at": table.updated_at.isoformat(),
                "column_count": column_count,
                "metadata_generated_count": metadata_count
            })
        
        return {
            "success": True,
            "dataset_id": dataset_id,
            "dataset_name": dataset.name,
            "total": total,
            "limit": limit,
            "offset": offset,
            "tables": result_tables
        }
    
    except Exception as e:
        logger.error(f"Failed to list tables: {str(e)}")
        return {
            "success": False,
            "error": f"Failed to list tables: {str(e)}"
        }
```

**Example Response**:
```json
{
  "success": true,
  "dataset_id": 1,
  "dataset_name": "sales_db",
  "total": 5,
  "tables": [
    {
      "id": 1,
      "dataset_id": 1,
      "name": "customers",
      "row_count": 10000,
      "description": "Customer master data",
      "metadata_generated": true,
      "created_at": "2024-01-15T10:31:00Z",
      "column_count": 15,
      "metadata_generated_count": 15
    }
  ]
}
```

---

### 4. get_table_schema

**Purpose**: Get complete schema of a table including all columns and their details

**Schema**:
```json
{
  "name": "get_table_schema",
  "description": "Get the complete schema of a table including all columns with data types, nullable status, and metadata.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "table_id": {
        "type": "integer",
        "description": "The ID of the table"
      }
    },
    "required": ["table_id"]
  }
}
```

**Implementation**:
```python
async def get_table_schema(table_id: int) -> dict:
    """
    Get complete table schema.
    
    Args:
        table_id: ID of table
    
    Returns:
        Dictionary with schema details
    """
    try:
        # Get table
        table = db.query(Table).filter(Table.id == table_id).first()
        if not table:
            return {
                "success": False,
                "error": f"Table {table_id} not found"
            }
        
        # Get dataset
        dataset = db.query(Dataset).filter(Dataset.id == table.dataset_id).first()
        
        # Get columns
        columns = db.query(Column).filter(Column.table_id == table_id).all()
        
        # Get relationships
        relationship_ids = [col.id for col in columns]
        relationships = db.query(Relationship).filter(
            (Relationship.source_column_id.in_(relationship_ids)) |
            (Relationship.target_column_id.in_(relationship_ids))
        ).all()
        
        # Build schema
        columns_schema = []
        for column in columns:
            metadata = db.query(Metadata).filter(Metadata.column_id == column.id).first()
            
            columns_schema.append({
                "id": column.id,
                "name": column.name,
                "data_type": column.data_type,
                "nullable": column.nullable,
                "sample_values": column.sample_values,
                "metadata": {
                    "business_description": metadata.business_description if metadata else None,
                    "business_category": metadata.business_category if metadata else None,
                    "tags": metadata.tags if metadata else None,
                    "sensitivity_level": metadata.sensitivity_level if metadata else None
                } if metadata else None
            })
        
        # Format relationships
        relationships_schema = []
        for rel in relationships:
            relationships_schema.append({
                "source_column_id": rel.source_column_id,
                "target_column_id": rel.target_column_id,
                "relationship_type": rel.relationship_type,
                "confidence": rel.confidence
            })
        
        return {
            "success": True,
            "table": {
                "id": table.id,
                "name": table.name,
                "dataset_id": table.dataset_id,
                "dataset_name": dataset.name,
                "row_count": table.row_count,
                "description": table.description,
                "created_at": table.created_at.isoformat()
            },
            "columns": columns_schema,
            "relationships": relationships_schema
        }
    
    except Exception as e:
        logger.error(f"Failed to get table schema: {str(e)}")
        return {
            "success": False,
            "error": f"Failed to get table schema: {str(e)}"
        }
```

**Example Response**:
```json
{
  "success": true,
  "table": {
    "id": 1,
    "name": "customers",
    "dataset_id": 1,
    "dataset_name": "sales_db",
    "row_count": 10000,
    "description": "Customer master data",
    "created_at": "2024-01-15T10:31:00Z"
  },
  "columns": [
    {
      "id": 1,
      "name": "customer_id",
      "data_type": "Integer",
      "nullable": false,
      "sample_values": ["1001", "1002", "1003"],
      "metadata": {
        "business_description": "Unique identifier for each customer",
        "business_category": "Customer",
        "tags": ["identifier", "primary_key"],
        "sensitivity_level": "Internal"
      }
    }
  ],
  "relationships": []
}
```

---

### 5. get_column_details

**Purpose**: Get comprehensive details about a specific column

**Schema**:
```json
{
  "name": "get_column_details",
  "description": "Get detailed information about a column including its metadata, relationships, and sample values.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "column_id": {
        "type": "integer",
        "description": "The ID of the column"
      }
    },
    "required": ["column_id"]
  }
}
```

**Implementation**:
```python
async def get_column_details(column_id: int) -> dict:
    """
    Get column details.
    
    Args:
        column_id: ID of column
    
    Returns:
        Dictionary with column details
    """
    try:
        # Get column
        column = db.query(Column).filter(Column.id == column_id).first()
        if not column:
            return {
                "success": False,
                "error": f"Column {column_id} not found"
            }
        
        # Get related entities
        table = db.query(Table).filter(Table.id == column.table_id).first()
        dataset = db.query(Dataset).filter(Dataset.id == table.dataset_id).first()
        metadata = db.query(Metadata).filter(Metadata.column_id == column_id).first()
        
        # Get relationships
        outgoing = db.query(Relationship).filter(
            Relationship.source_column_id == column_id
        ).all()
        incoming = db.query(Relationship).filter(
            Relationship.target_column_id == column_id
        ).all()
        
        return {
            "success": True,
            "column": {
                "id": column.id,
                "name": column.name,
                "data_type": column.data_type,
                "nullable": column.nullable,
                "sample_values": column.sample_values,
                "created_at": column.created_at.isoformat()
            },
            "hierarchy": {
                "dataset_id": dataset.id,
                "dataset_name": dataset.name,
                "table_id": table.id,
                "table_name": table.name
            },
            "metadata": {
                "business_description": metadata.business_description if metadata else None,
                "business_category": metadata.business_category if metadata else None,
                "tags": metadata.tags if metadata else None,
                "sensitivity_level": metadata.sensitivity_level if metadata else None,
                "generated_at": metadata.generated_at.isoformat() if metadata else None
            } if metadata else None,
            "relationships": {
                "outgoing": [
                    {
                        "target_column_id": rel.target_column_id,
                        "relationship_type": rel.relationship_type,
                        "confidence": rel.confidence
                    } for rel in outgoing
                ],
                "incoming": [
                    {
                        "source_column_id": rel.source_column_id,
                        "relationship_type": rel.relationship_type,
                        "confidence": rel.confidence
                    } for rel in incoming
                ]
            }
        }
    
    except Exception as e:
        logger.error(f"Failed to get column details: {str(e)}")
        return {
            "success": False,
            "error": f"Failed to get column details: {str(e)}"
        }
```

---

### 6. generate_metadata

**Purpose**: Trigger metadata generation for a specific column using Gemini

**Schema**:
```json
{
  "name": "generate_metadata",
  "description": "Trigger AI-powered metadata generation for a column using Gemini. Returns the generated business description, category, tags, and sensitivity level.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "column_id": {
        "type": "integer",
        "description": "The ID of the column to generate metadata for"
      },
      "force_regenerate": {
        "type": "boolean",
        "description": "Force regeneration even if metadata already exists",
        "default": false
      }
    },
    "required": ["column_id"]
  }
}
```

**Implementation**:
```python
async def generate_metadata(
    column_id: int,
    force_regenerate: bool = False
) -> dict:
    """
    Generate metadata for a column using Gemini.
    
    Args:
        column_id: ID of column
        force_regenerate: Force regeneration
    
    Returns:
        Dictionary with generated metadata
    """
    try:
        # Get column
        column = db.query(Column).filter(Column.id == column_id).first()
        if not column:
            return {
                "success": False,
                "error": f"Column {column_id} not found"
            }
        
        # Check if metadata already exists
        existing_metadata = db.query(Metadata).filter(
            Metadata.column_id == column_id
        ).first()
        
        if existing_metadata and not force_regenerate:
            return {
                "success": True,
                "metadata": {
                    "business_description": existing_metadata.business_description,
                    "business_category": existing_metadata.business_category,
                    "tags": existing_metadata.tags,
                    "sensitivity_level": existing_metadata.sensitivity_level
                },
                "message": "Metadata already exists"
            }
        
        # Generate metadata using Gemini
        metadata = await gemini_service.generate_metadata(
            column_name=column.name,
            data_type=column.data_type,
            sample_values=column.sample_values
        )
        
        # Generate embedding
        embedding = await gemini_service.generate_embedding(
            metadata['business_description']
        )
        
        # Save metadata
        if existing_metadata and force_regenerate:
            existing_metadata.business_description = metadata['business_description']
            existing_metadata.business_category = metadata['business_category']
            existing_metadata.tags = metadata['tags']
            existing_metadata.sensitivity_level = metadata['sensitivity_level']
            existing_metadata.embedding = embedding
            db.commit()
        else:
            new_metadata = Metadata(
                column_id=column_id,
                business_description=metadata['business_description'],
                business_category=metadata['business_category'],
                tags=metadata['tags'],
                sensitivity_level=metadata['sensitivity_level'],
                embedding=embedding,
                generated_by="mcp_tool"
            )
            db.add(new_metadata)
            db.commit()
        
        return {
            "success": True,
            "metadata": metadata,
            "message": "Metadata generated successfully"
        }
    
    except Exception as e:
        logger.error(f"Failed to generate metadata: {str(e)}")
        return {
            "success": False,
            "error": f"Failed to generate metadata: {str(e)}"
        }
```

---

## MCP Server Implementation

### FastAPI MCP Endpoint

```python
# backend/mcp/server.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Any, Dict, Optional

app = FastAPI(title="AI Catalog MCP Server")

# Tool registry
TOOLS = {
    "search_catalog": search_catalog,
    "list_datasets": list_datasets,
    "list_tables": list_tables,
    "get_table_schema": get_table_schema,
    "get_column_details": get_column_details,
    "generate_metadata": generate_metadata,
}

class MCPRequest(BaseModel):
    jsonrpc: str = "2.0"
    method: str
    params: Dict[str, Any]
    id: Optional[int] = None

class MCPResponse(BaseModel):
    jsonrpc: str = "2.0"
    result: Optional[Dict[str, Any]] = None
    error: Optional[Dict[str, Any]] = None
    id: Optional[int] = None

@app.post("/mcp", response_model=MCPResponse)
async def mcp_handler(request: MCPRequest) -> MCPResponse:
    """
    Handle MCP requests (JSON-RPC 2.0).
    """
    try:
        if request.method not in TOOLS:
            return MCPResponse(
                id=request.id,
                error={
                    "code": -32601,
                    "message": f"Method '{request.method}' not found"
                }
            )
        
        # Call the tool
        tool_func = TOOLS[request.method]
        result = await tool_func(**request.params)
        
        return MCPResponse(
            id=request.id,
            result=result
        )
    
    except ValueError as e:
        return MCPResponse(
            id=request.id,
            error={
                "code": -32602,
                "message": f"Invalid params: {str(e)}"
            }
        )
    except Exception as e:
        logger.error(f"MCP error: {str(e)}")
        return MCPResponse(
            id=request.id,
            error={
                "code": -32603,
                "message": f"Internal error: {str(e)}"
            }
        )

@app.get("/mcp/tools")
async def list_mcp_tools():
    """
    Get list of available MCP tools.
    """
    return {
        "tools": [
            {
                "name": "search_catalog",
                "description": "Search catalog semantically or by keyword"
            },
            {
                "name": "list_datasets",
                "description": "List all available datasets"
            },
            {
                "name": "list_tables",
                "description": "List tables in a dataset"
            },
            {
                "name": "get_table_schema",
                "description": "Get table schema with columns"
            },
            {
                "name": "get_column_details",
                "description": "Get column details and metadata"
            },
            {
                "name": "generate_metadata",
                "description": "Generate metadata for a column"
            }
        ]
    }
```

---

## MCP Client Integration

### Claude/External LLM Integration

```python
# Example: Using MCP tools from Claude

from anthropic import Anthropic

client = Anthropic()

# Define MCP tools for Claude
tools = [
    {
        "name": "search_catalog",
        "description": "Search the data catalog semantically",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Search query"
                },
                "search_type": {
                    "type": "string",
                    "enum": ["semantic", "keyword"]
                },
                "limit": {
                    "type": "integer",
                    "default": 10
                }
            },
            "required": ["query"]
        }
    },
    # ... other tools
]

async def call_mcp_tool(tool_name: str, tool_input: dict) -> dict:
    """Call MCP tool."""
    response = await http_client.post(
        "http://localhost:8000/mcp",
        json={
            "jsonrpc": "2.0",
            "method": tool_name,
            "params": tool_input,
            "id": 1
        }
    )
    return response.json()

async def chat_with_catalog(user_message: str):
    """Chat with Claude using catalog tools."""
    messages = [{"role": "user", "content": user_message}]
    
    while True:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            tools=tools,
            messages=messages
        )
        
        # Check if Claude wants to use a tool
        if response.stop_reason == "tool_use":
            for block in response.content:
                if block.type == "tool_use":
                    tool_name = block.name
                    tool_input = block.input
                    
                    # Call the tool
                    tool_result = await call_mcp_tool(tool_name, tool_input)
                    
                    # Add to messages
                    messages.append({
                        "role": "assistant",
                        "content": response.content
                    })
                    messages.append({
                        "role": "user",
                        "content": [
                            {
                                "type": "tool_result",
                                "tool_use_id": block.id,
                                "content": json.dumps(tool_result)
                            }
                        ]
                    })
        else:
            # Claude is done
            return response.content[0].text
```

---

## Frontend MCP Playground

### React Component

```typescript
// frontend/src/pages/MCPPlayground.tsx

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface ToolRequest {
  name: string;
  parameters: Record<string, any>;
}

interface ToolResponse {
  success: boolean;
  data: any;
  executionTime: number;
}

export const MCPPlayground: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState('search_catalog');
  const [parameters, setParameters] = useState<Record<string, any>>({
    query: '',
    search_type: 'semantic',
    limit: 10
  });
  const [response, setResponse] = useState<ToolResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const tools = [
    'search_catalog',
    'list_datasets',
    'list_tables',
    'get_table_schema',
    'get_column_details',
    'generate_metadata'
  ];

  const handleExecute = async () => {
    setLoading(true);
    const startTime = performance.now();
    
    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: selectedTool,
          params: parameters,
          id: 1
        })
      });
      
      const data = await res.json();
      const executionTime = performance.now() - startTime;
      
      setResponse({
        success: data.result?.success ?? true,
        data: data.result,
        executionTime
      });
    } catch (error) {
      setResponse({
        success: false,
        data: { error: error instanceof Error ? error.message : 'Unknown error' },
        executionTime: performance.now() - startTime
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">MCP Playground</h2>
          <p className="text-gray-600">Test MCP tools interactively</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tool</label>
            <Select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
            >
              {tools.map((tool) => (
                <option key={tool} value={tool}>{tool}</option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Parameters (JSON)</label>
            <textarea
              className="w-full h-32 p-2 border rounded font-mono text-sm"
              value={JSON.stringify(parameters, null, 2)}
              onChange={(e) => {
                try {
                  setParameters(JSON.parse(e.target.value));
                } catch {}
              }}
            />
          </div>

          <Button
            onClick={handleExecute}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Executing...' : 'Execute Tool'}
          </Button>
        </CardContent>
      </Card>

      {response && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold">Response</h3>
            <p className="text-sm text-gray-600">
              Execution time: {response.executionTime.toFixed(2)}ms
            </p>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
```

---

## MCP Testing

### Unit Tests

```python
# tests/test_mcp_tools.py

import pytest
from backend.mcp.tools import (
    search_catalog, list_datasets, list_tables,
    get_table_schema, get_column_details, generate_metadata
)

@pytest.mark.asyncio
async def test_search_catalog():
    """Test semantic search."""
    result = await search_catalog(
        query="customer information",
        search_type="semantic",
        limit=5
    )
    assert result['success'] == True
    assert 'results' in result
    assert len(result['results']) <= 5

@pytest.mark.asyncio
async def test_list_datasets():
    """Test listing datasets."""
    result = await list_datasets(limit=10)
    assert result['success'] == True
    assert 'datasets' in result

@pytest.mark.asyncio
async def test_list_tables():
    """Test listing tables."""
    # Assuming dataset ID 1 exists
    result = await list_tables(dataset_id=1, limit=10)
    assert result['success'] == True
    assert 'tables' in result

@pytest.mark.asyncio
async def test_get_table_schema():
    """Test getting table schema."""
    result = await get_table_schema(table_id=1)
    assert result['success'] == True
    assert 'columns' in result
    assert 'table' in result

@pytest.mark.asyncio
async def test_get_column_details():
    """Test getting column details."""
    result = await get_column_details(column_id=1)
    assert result['success'] == True
    assert 'column' in result
    assert 'metadata' in result
```

---

**✓ STEP 4: MCP Architecture Complete**

Creating STEP 5: Agent Architecture...
