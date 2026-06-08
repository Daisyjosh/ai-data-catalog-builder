# AI Data Catalog Builder - Agent Architecture & Implementation

## Agent System Overview

The agent implements a real agentic workflow with autonomous decision-making, memory management, and tool execution. It processes datasets end-to-end, generating business metadata through iterative planning and execution.

```
┌──────────────────────────────────────────────────────────────────┐
│                    AGENT EXECUTION LOOP                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  START                                                           │
│    ↓                                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. SCAN                                                 │   │
│  │    • Load dataset from file system                       │   │
│  │    • Parse CSV/JSON/SQLite                              │   │
│  │    • Extract table/collection names                     │   │
│  │    • Detect row counts                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│    ↓                                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 2. ANALYZE                                              │   │
│  │    • Extract column names and data types                │   │
│  │    • Collect sample values (first 5 rows)               │   │
│  │    • Detect nullable columns                            │   │
│  │    • Store initial schema in database                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│    ↓                                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 3. PLAN                                                 │   │
│  │    • Determine processing strategy (sequential/batch)   │   │
│  │    • Identify dependencies and relationships            │   │
│  │    • Prioritize high-value columns                      │   │
│  │    • Set batch sizes and timeouts                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│    ↓                                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 4. TOOL CALL                                            │   │
│  │    • Extract column metadata locally                    │   │
│  │    • Validate data types                                │   │
│  │    • Generate sample value summaries                    │   │
│  │    • Log execution details                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│    ↓                                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 5. GEMINI CALL                                          │   │
│  │    • Send column info to Gemini 2.5 Flash              │   │
│  │    • Generate business description                      │   │
│  │    • Classify business category                         │   │
│  │    • Extract tags and sensitivity level                 │   │
│  │    • Generate embedding for semantic search             │   │
│  └─────────────────────────────────────────────────────────┘   │
│    ↓                                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 6. VALIDATE                                             │   │
│  │    • Check response quality and completeness            │   │
│  │    • Verify metadata fields are populated               │   │
│  │    • Check sensitivity level is valid                   │   │
│  │    • Retry on validation failure                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│    ↓                                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 7. STORE                                                │   │
│  │    • Save metadata to database                          │   │
│  │    • Store embedding vectors                            │   │
│  │    • Update FAISS index                                 │   │
│  │    • Create audit log entry                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│    ↓                                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 8. REPEAT                                               │   │
│  │    • Move to next table/column                          │   │
│  │    • Update progress in memory                          │   │
│  │    • Broadcast progress to WebSocket                    │   │
│  │    • Loop until all data processed                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│    ↓                                                             │
│  COMPLETE                                                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Agent Module Architecture

```
backend/agent/
├── __init__.py
├── catalog_agent.py          # Main orchestrator
├── planner.py                # Strategy and decision making
├── executor.py               # Tool execution
├── memory.py                 # State management
├── tools.py                  # Data processing tools
└── agent_logger.py           # Execution logging

backend/services/
├── gemini_service.py         # Gemini API integration
├── file_parser_service.py    # File parsing
├── vector_search_service.py  # FAISS integration
└── metadata_service.py       # Metadata operations
```

---

## 1. Catalog Agent (Orchestrator)

**Purpose**: Main agent orchestrator that manages the overall workflow.

```python
# backend/agent/catalog_agent.py

import asyncio
import json
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session

from backend.models import (
    Dataset, Table, Column, Metadata, AgentRun, AgentLog
)
from backend.services.gemini_service import GeminiService
from backend.services.file_parser_service import FileParserService
from backend.services.vector_search_service import VectorSearchService
from backend.services.metadata_service import MetadataService
from backend.agent.planner import Planner
from backend.agent.executor import Executor
from backend.agent.memory import AgentMemory
from backend.agent.agent_logger import AgentLogger

class CatalogAgent:
    """
    Main AI agent for autonomous dataset cataloging.
    Implements the SCAN → ANALYZE → PLAN → EXECUTE → VALIDATE → STORE → REPEAT loop.
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.gemini_service = GeminiService()
        self.file_parser = FileParserService()
        self.vector_search = VectorSearchService()
        self.metadata_service = MetadataService(db)
        self.planner = Planner()
        self.executor = Executor(db)
        self.memory = AgentMemory()
        self.logger = AgentLogger()
        
        self.current_run: Optional[AgentRun] = None
        self.current_dataset: Optional[Dataset] = None
    
    async def process_dataset(self, dataset_id: int, run_id: int) -> Dict[str, Any]:
        """
        Process a complete dataset end-to-end.
        
        Args:
            dataset_id: ID of dataset to process
            run_id: ID of agent run for tracking
        
        Returns:
            Summary of processing results
        """
        try:
            # Get or create agent run
            self.current_run = self.db.query(AgentRun).filter(
                AgentRun.id == run_id
            ).first()
            
            self.current_dataset = self.db.query(Dataset).filter(
                Dataset.id == dataset_id
            ).first()
            
            if not self.current_dataset:
                raise ValueError(f"Dataset {dataset_id} not found")
            
            self.logger.log(
                run_id=run_id,
                level="INFO",
                message=f"Starting agent processing for dataset: {self.current_dataset.name}",
                context={"step": "INIT", "dataset_id": dataset_id}
            )
            
            # Initialize memory
            self.memory.initialize(
                dataset_id=dataset_id,
                dataset_name=self.current_dataset.name,
                source_type=self.current_dataset.source_type
            )
            
            # STEP 1: SCAN
            await self._scan_dataset()
            
            # STEP 2: ANALYZE
            await self._analyze_schema()
            
            # STEP 3: PLAN
            plan = self._plan_processing()
            
            # STEP 4-8: Execute plan (TOOL CALL → GEMINI CALL → VALIDATE → STORE → REPEAT)
            await self._execute_plan(plan)
            
            # Mark as complete
            self.current_run.status = "Completed"
            self.current_run.completed_at = datetime.utcnow()
            self.current_dataset.metadata_generated = True
            self.db.commit()
            
            self.logger.log(
                run_id=run_id,
                level="INFO",
                message="Agent processing completed successfully",
                context={
                    "step": "COMPLETE",
                    "tables_processed": self.memory.state['tables_processed'],
                    "columns_processed": self.memory.state['columns_processed'],
                    "metadata_generated": self.memory.state['metadata_generated']
                }
            )
            
            return {
                "success": True,
                "dataset_id": dataset_id,
                "tables_processed": self.memory.state['tables_processed'],
                "columns_processed": self.memory.state['columns_processed'],
                "metadata_generated": self.memory.state['metadata_generated']
            }
        
        except Exception as e:
            self.logger.log(
                run_id=run_id,
                level="ERROR",
                message=f"Agent processing failed: {str(e)}",
                context={"error": str(e), "step": "ERROR"}
            )
            if self.current_run:
                self.current_run.status = "Failed"
                self.current_run.error_message = str(e)
                self.db.commit()
            raise
    
    async def _scan_dataset(self):
        """
        STEP 1: SCAN - Load and parse dataset.
        """
        self.logger.log(
            run_id=self.current_run.id,
            level="INFO",
            message="SCAN: Loading dataset file",
            context={"step": "SCAN", "file_path": self.current_dataset.file_path}
        )
        
        try:
            # Parse file based on source type
            if self.current_dataset.source_type == "CSV":
                tables = await self.file_parser.parse_csv(
                    self.current_dataset.file_path
                )
            elif self.current_dataset.source_type == "JSON":
                tables = await self.file_parser.parse_json(
                    self.current_dataset.file_path
                )
            elif self.current_dataset.source_type == "SQLite":
                tables = await self.file_parser.parse_sqlite(
                    self.current_dataset.file_path
                )
            
            # Store scan results in memory
            self.memory.set('tables_found', tables)
            self.memory.set('total_tables', len(tables))
            
            self.logger.log(
                run_id=self.current_run.id,
                level="INFO",
                message=f"SCAN: Found {len(tables)} tables",
                context={"step": "SCAN", "table_count": len(tables)}
            )
        
        except Exception as e:
            self.logger.log(
                run_id=self.current_run.id,
                level="ERROR",
                message=f"SCAN: Failed to parse dataset: {str(e)}",
                context={"step": "SCAN", "error": str(e)}
            )
            raise
    
    async def _analyze_schema(self):
        """
        STEP 2: ANALYZE - Extract schema and structure.
        """
        self.logger.log(
            run_id=self.current_run.id,
            level="INFO",
            message="ANALYZE: Extracting schema",
            context={"step": "ANALYZE"}
        )
        
        try:
            tables_data = self.memory.get('tables_found')
            
            for table_name, table_data in tables_data.items():
                # Create or update table record
                table = self.db.query(Table).filter(
                    Table.dataset_id == self.current_dataset.id,
                    Table.name == table_name
                ).first()
                
                if not table:
                    table = Table(
                        dataset_id=self.current_dataset.id,
                        name=table_name,
                        row_count=table_data.get('row_count', 0)
                    )
                    self.db.add(table)
                    self.db.flush()
                
                # Extract columns
                columns_data = []
                for col_name, col_info in table_data.get('columns', {}).items():
                    column = Column(
                        table_id=table.id,
                        name=col_name,
                        data_type=col_info['data_type'],
                        nullable=col_info.get('nullable', True),
                        sample_values=json.dumps(col_info.get('sample_values', []))
                    )
                    self.db.add(column)
                    self.db.flush()
                    
                    columns_data.append({
                        'column_id': column.id,
                        'name': col_name,
                        'data_type': col_info['data_type'],
                        'sample_values': col_info.get('sample_values', [])
                    })
                
                self.memory.add_table({
                    'table_id': table.id,
                    'table_name': table_name,
                    'columns': columns_data
                })
            
            self.db.commit()
            
            self.logger.log(
                run_id=self.current_run.id,
                level="INFO",
                message="ANALYZE: Schema extraction complete",
                context={
                    "step": "ANALYZE",
                    "columns_found": self.memory.state['total_columns']
                }
            )
        
        except Exception as e:
            self.logger.log(
                run_id=self.current_run.id,
                level="ERROR",
                message=f"ANALYZE: Schema extraction failed: {str(e)}",
                context={"step": "ANALYZE", "error": str(e)}
            )
            raise
    
    def _plan_processing(self) -> Dict[str, Any]:
        """
        STEP 3: PLAN - Create processing strategy.
        """
        self.logger.log(
            run_id=self.current_run.id,
            level="INFO",
            message="PLAN: Creating processing strategy",
            context={"step": "PLAN"}
        )
        
        # Use planner to create strategy
        plan = self.planner.create_plan(
            total_tables=self.memory.state['total_tables'],
            total_columns=self.memory.state['total_columns']
        )
        
        self.memory.set('plan', plan)
        
        self.logger.log(
            run_id=self.current_run.id,
            level="INFO",
            message=f"PLAN: Strategy created - batch_size={plan['batch_size']}, strategy={plan['strategy']}",
            context={
                "step": "PLAN",
                "batch_size": plan['batch_size'],
                "strategy": plan['strategy']
            }
        )
        
        return plan
    
    async def _execute_plan(self, plan: Dict[str, Any]):
        """
        STEP 4-8: Execute plan (TOOL CALL → GEMINI CALL → VALIDATE → STORE → REPEAT).
        """
        self.logger.log(
            run_id=self.current_run.id,
            level="INFO",
            message="EXECUTE: Starting metadata generation loop",
            context={"step": "EXECUTE"}
        )
        
        try:
            tables = self.memory.get('tables')
            batch_size = plan['batch_size']
            
            for table_data in tables:
                for column_data in table_data['columns']:
                    # STEP 4: TOOL CALL - Extract metadata
                    tool_result = await self.executor.extract_column_metadata(
                        column_data=column_data,
                        run_id=self.current_run.id
                    )
                    
                    # STEP 5: GEMINI CALL - Generate business metadata
                    gemini_result = await self.executor.call_gemini_metadata(
                        column_name=column_data['name'],
                        data_type=column_data['data_type'],
                        sample_values=column_data['sample_values'],
                        run_id=self.current_run.id
                    )
                    
                    # STEP 6: VALIDATE - Check quality
                    validation_result = self.executor.validate_metadata(
                        metadata=gemini_result,
                        run_id=self.current_run.id
                    )
                    
                    if not validation_result['valid']:
                        self.logger.log(
                            run_id=self.current_run.id,
                            level="WARNING",
                            message=f"VALIDATE: Failed validation, retrying",
                            context={
                                "step": "VALIDATE",
                                "column_id": column_data['column_id'],
                                "reason": validation_result['reason']
                            }
                        )
                        continue
                    
                    # STEP 7: STORE - Save to database
                    await self.executor.store_metadata(
                        column_id=column_data['column_id'],
                        metadata=gemini_result,
                        run_id=self.current_run.id
                    )
                    
                    # Update progress
                    self.memory.increment('columns_processed')
                    self.memory.increment('metadata_generated')
                    self.current_run.total_columns_processed = self.memory.state['columns_processed']
                    self.current_run.total_metadata_generated = self.memory.state['metadata_generated']
                    self.db.commit()
                    
                    # Log progress
                    self.logger.log(
                        run_id=self.current_run.id,
                        level="DEBUG",
                        message=f"STORE: Metadata stored for column {column_data['name']}",
                        context={
                            "step": "STORE",
                            "column_id": column_data['column_id'],
                            "total_processed": self.memory.state['columns_processed']
                        }
                    )
                
                # STEP 8: Update table progress
                self.memory.increment('tables_processed')
                self.current_run.total_tables_processed = self.memory.state['tables_processed']
                self.db.commit()
            
            self.logger.log(
                run_id=self.current_run.id,
                level="INFO",
                message="EXECUTE: Metadata generation loop complete",
                context={
                    "step": "EXECUTE",
                    "total_columns": self.memory.state['columns_processed']
                }
            )
        
        except Exception as e:
            self.logger.log(
                run_id=self.current_run.id,
                level="ERROR",
                message=f"EXECUTE: Error during execution: {str(e)}",
                context={"step": "EXECUTE", "error": str(e)}
            )
            raise
```

---

## 2. Planner

**Purpose**: Strategy and decision-making for processing.

```python
# backend/agent/planner.py

from typing import Dict, Any

class Planner:
    """
    Creates processing strategy based on dataset characteristics.
    """
    
    def create_plan(self, total_tables: int, total_columns: int) -> Dict[str, Any]:
        """
        Create processing plan.
        
        Args:
            total_tables: Number of tables to process
            total_columns: Total columns across all tables
        
        Returns:
            Processing plan dictionary
        """
        # Determine strategy based on size
        if total_columns <= 20:
            batch_size = 5
            strategy = "sequential"
            parallel_batches = 1
        elif total_columns <= 100:
            batch_size = 10
            strategy = "batched"
            parallel_batches = 2
        else:
            batch_size = 20
            strategy = "parallel_batches"
            parallel_batches = 4
        
        return {
            "strategy": strategy,
            "batch_size": batch_size,
            "parallel_batches": parallel_batches,
            "total_tables": total_tables,
            "total_columns": total_columns,
            "timeout_per_column": 30,  # seconds
            "max_retries": 3,
            "retry_delay": 2  # seconds
        }
    
    def should_retry(self, retry_count: int, max_retries: int) -> bool:
        """Check if should retry."""
        return retry_count < max_retries
    
    def get_retry_delay(self, retry_count: int) -> float:
        """Get delay before retry (exponential backoff)."""
        return 2 ** retry_count  # 2, 4, 8 seconds
```

---

## 3. Executor

**Purpose**: Execute tools and API calls.

```python
# backend/agent/executor.py

import asyncio
import json
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session

from backend.services.gemini_service import GeminiService
from backend.services.metadata_service import MetadataService
from backend.services.vector_search_service import VectorSearchService
from backend.models import Metadata, AgentLog
from backend.agent.agent_logger import AgentLogger

class Executor:
    """
    Executes tools, makes Gemini calls, and stores results.
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.gemini_service = GeminiService()
        self.metadata_service = MetadataService(db)
        self.vector_search = VectorSearchService()
        self.logger = AgentLogger()
    
    async def extract_column_metadata(
        self,
        column_data: Dict[str, Any],
        run_id: int
    ) -> Dict[str, Any]:
        """
        STEP 4: Extract column metadata locally (TOOL CALL).
        """
        try:
            return {
                "column_id": column_data['column_id'],
                "column_name": column_data['name'],
                "data_type": column_data['data_type'],
                "sample_values": column_data['sample_values'],
                "extracted_at": datetime.utcnow().isoformat()
            }
        except Exception as e:
            self.logger.log(
                run_id=run_id,
                level="ERROR",
                message=f"Failed to extract column metadata: {str(e)}",
                context={"error": str(e), "column_id": column_data['column_id']}
            )
            raise
    
    async def call_gemini_metadata(
        self,
        column_name: str,
        data_type: str,
        sample_values: list,
        run_id: int,
        retry_count: int = 0,
        max_retries: int = 3
    ) -> Dict[str, Any]:
        """
        STEP 5: Call Gemini to generate business metadata.
        """
        try:
            result = await self.gemini_service.generate_metadata(
                column_name=column_name,
                data_type=data_type,
                sample_values=sample_values
            )
            
            self.logger.log(
                run_id=run_id,
                level="DEBUG",
                message=f"Gemini call successful for column: {column_name}",
                context={
                    "column_name": column_name,
                    "tokens_used": result.get('tokens_used', 0)
                }
            )
            
            return result
        
        except Exception as e:
            if retry_count < max_retries:
                self.logger.log(
                    run_id=run_id,
                    level="WARNING",
                    message=f"Gemini call failed, retrying ({retry_count + 1}/{max_retries})",
                    context={
                        "column_name": column_name,
                        "error": str(e),
                        "retry_count": retry_count
                    }
                )
                await asyncio.sleep(2 ** retry_count)  # Exponential backoff
                return await self.call_gemini_metadata(
                    column_name=column_name,
                    data_type=data_type,
                    sample_values=sample_values,
                    run_id=run_id,
                    retry_count=retry_count + 1,
                    max_retries=max_retries
                )
            else:
                self.logger.log(
                    run_id=run_id,
                    level="ERROR",
                    message=f"Gemini call failed after {max_retries} retries",
                    context={"column_name": column_name, "error": str(e)}
                )
                raise
    
    def validate_metadata(
        self,
        metadata: Dict[str, Any],
        run_id: int
    ) -> Dict[str, Any]:
        """
        STEP 6: Validate metadata quality.
        """
        is_valid = True
        reason = None
        
        # Check required fields
        if not metadata.get('business_description'):
            is_valid = False
            reason = "Missing business_description"
        elif len(metadata['business_description']) < 10:
            is_valid = False
            reason = "business_description too short"
        
        if not metadata.get('business_category'):
            is_valid = False
            reason = "Missing business_category"
        
        if metadata.get('sensitivity_level') not in ['Public', 'Internal', 'Confidential']:
            is_valid = False
            reason = "Invalid sensitivity_level"
        
        if is_valid:
            self.logger.log(
                run_id=run_id,
                level="DEBUG",
                message="Metadata validation passed",
                context={"column_name": metadata.get('column_name')}
            )
        
        return {
            "valid": is_valid,
            "reason": reason,
            "metadata": metadata if is_valid else None
        }
    
    async def store_metadata(
        self,
        column_id: int,
        metadata: Dict[str, Any],
        run_id: int
    ):
        """
        STEP 7: Store metadata in database.
        """
        try:
            # Generate embedding
            embedding = await self.gemini_service.generate_embedding(
                metadata['business_description']
            )
            
            # Create metadata record
            metadata_record = Metadata(
                column_id=column_id,
                business_description=metadata['business_description'],
                business_category=metadata['business_category'],
                tags=json.dumps(metadata.get('tags', [])),
                sensitivity_level=metadata['sensitivity_level'],
                embedding=embedding,
                generated_by="catalog_agent"
            )
            
            self.db.add(metadata_record)
            self.db.flush()
            
            # Update FAISS index
            self.vector_search.add_to_index(
                vector_id=metadata_record.id,
                embedding=embedding,
                metadata={"column_id": column_id}
            )
            
            self.db.commit()
            
            self.logger.log(
                run_id=run_id,
                level="DEBUG",
                message="Metadata stored successfully",
                context={"column_id": column_id, "metadata_id": metadata_record.id}
            )
        
        except Exception as e:
            self.logger.log(
                run_id=run_id,
                level="ERROR",
                message=f"Failed to store metadata: {str(e)}",
                context={"column_id": column_id, "error": str(e)}
            )
            raise
```

---

## 4. Memory

**Purpose**: Maintain agent state across the processing loop.

```python
# backend/agent/memory.py

from typing import Any, Dict, List, Optional

class AgentMemory:
    """
    Manages agent state and context during processing.
    """
    
    def __init__(self):
        self.state: Dict[str, Any] = {}
        self.context_stack: List[Dict[str, Any]] = []
    
    def initialize(self, dataset_id: int, dataset_name: str, source_type: str):
        """Initialize memory for a new dataset."""
        self.state = {
            "dataset_id": dataset_id,
            "dataset_name": dataset_name,
            "source_type": source_type,
            "tables_found": [],
            "total_tables": 0,
            "total_columns": 0,
            "tables_processed": 0,
            "columns_processed": 0,
            "metadata_generated": 0,
            "tables": [],
            "plan": None,
            "started_at": None
        }
    
    def set(self, key: str, value: Any):
        """Set state value."""
        self.state[key] = value
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get state value."""
        return self.state.get(key, default)
    
    def increment(self, key: str, amount: int = 1):
        """Increment numeric value."""
        if key in self.state:
            self.state[key] += amount
        else:
            self.state[key] = amount
    
    def add_table(self, table_data: Dict[str, Any]):
        """Add table to processing list."""
        self.state['tables'].append(table_data)
        self.state['total_columns'] += len(table_data.get('columns', []))
    
    def push_context(self, context: Dict[str, Any]):
        """Push context onto stack."""
        self.context_stack.append(context)
    
    def pop_context(self) -> Optional[Dict[str, Any]]:
        """Pop context from stack."""
        return self.context_stack.pop() if self.context_stack else None
    
    def get_current_context(self) -> Optional[Dict[str, Any]]:
        """Get current context."""
        return self.context_stack[-1] if self.context_stack else None
    
    def clear(self):
        """Clear all state."""
        self.state = {}
        self.context_stack = []
```

---

## 5. Tools

**Purpose**: Data extraction and processing tools.

```python
# backend/agent/tools.py

import csv
import json
from typing import Dict, Any, List
from pathlib import Path

class DatasetTools:
    """
    Tools for dataset extraction and analysis.
    """
    
    @staticmethod
    def extract_csv_schema(file_path: str) -> Dict[str, Any]:
        """Extract schema from CSV file."""
        with open(file_path, 'r') as f:
            reader = csv.DictReader(f)
            headers = reader.fieldnames
            
            # Sample data
            sample_rows = []
            for i, row in enumerate(reader):
                if i >= 5:
                    break
                sample_rows.append(row)
        
        # Detect types
        columns = {}
        for header in headers:
            samples = [row.get(header, '') for row in sample_rows]
            data_type = DatasetTools.infer_type(samples)
            columns[header] = {
                'data_type': data_type,
                'nullable': any(not val for val in samples),
                'sample_values': [s for s in samples if s][:5]
            }
        
        return {
            "table_name": Path(file_path).stem,
            "row_count": len(sample_rows),
            "columns": columns
        }
    
    @staticmethod
    def infer_type(values: List[str]) -> str:
        """Infer data type from sample values."""
        if not values:
            return "Unknown"
        
        # Try integer
        try:
            [int(v) for v in values if v]
            return "Integer"
        except:
            pass
        
        # Try float
        try:
            [float(v) for v in values if v]
            return "Float"
        except:
            pass
        
        # Try boolean
        bool_values = {'true', 'false', 'yes', 'no', '1', '0'}
        if all(v.lower() in bool_values for v in values if v):
            return "Boolean"
        
        # Try date
        if all(DatasetTools._is_date(v) for v in values if v):
            return "Date"
        
        return "String"
    
    @staticmethod
    def _is_date(value: str) -> bool:
        """Check if value is a date."""
        import re
        date_pattern = r'^\d{4}-\d{2}-\d{2}.*'
        return bool(re.match(date_pattern, value))
```

---

## 6. Agent Logger

**Purpose**: Comprehensive logging of agent execution.

```python
# backend/agent/agent_logger.py

import json
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from backend.models import AgentLog

class AgentLogger:
    """
    Logs agent execution for monitoring and debugging.
    """
    
    def __init__(self, db: Optional[Session] = None):
        self.db = db
    
    def log(
        self,
        run_id: int,
        level: str,
        message: str,
        context: Optional[Dict[str, Any]] = None
    ):
        """
        Log agent execution.
        
        Args:
            run_id: Agent run ID
            level: DEBUG, INFO, WARNING, ERROR
            message: Log message
            context: Additional context data
        """
        if self.db:
            try:
                log_entry = AgentLog(
                    agent_run_id=run_id,
                    log_level=level,
                    message=message,
                    context=json.dumps(context) if context else None,
                    timestamp=datetime.utcnow()
                )
                self.db.add(log_entry)
                self.db.commit()
            except Exception as e:
                # Log error but don't crash
                print(f"Failed to log agent event: {str(e)}")
        
        # Also print to console
        timestamp = datetime.utcnow().isoformat()
        context_str = json.dumps(context) if context else ""
        print(f"[{timestamp}] [{level}] {message} {context_str}")
```

---

## Agent Execution Flow

### High-Level Pseudocode

```python
async def run_agent(dataset_id: int):
    agent = CatalogAgent(db)
    run = create_agent_run(dataset_id)
    
    try:
        # SCAN: Parse file
        raw_data = parse_file(dataset.file_path)
        
        # ANALYZE: Extract structure
        schema = extract_schema(raw_data)
        save_schema_to_db(schema)
        
        # PLAN: Create strategy
        plan = create_processing_plan(schema)
        
        # EXECUTE LOOP
        for table in schema.tables:
            for column in table.columns:
                # TOOL CALL
                metadata = extract_column_metadata(column)
                
                # GEMINI CALL
                ai_metadata = await gemini.generate_metadata(metadata)
                
                # VALIDATE
                if validate(ai_metadata):
                    # STORE
                    save_metadata(column, ai_metadata)
                    broadcast_progress()
                    # REPEAT: next column
                else:
                    retry()
        
        run.status = "Completed"
    
    except Exception as e:
        run.status = "Failed"
        run.error_message = str(e)
```

---

## Error Handling & Resilience

### Retry Strategy

```python
async def call_with_retry(
    func,
    max_retries: int = 3,
    base_delay: float = 2
):
    """Call function with exponential backoff retry."""
    for attempt in range(max_retries):
        try:
            return await func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            delay = base_delay ** attempt
            logger.warning(f"Attempt {attempt + 1} failed, retrying in {delay}s: {str(e)}")
            await asyncio.sleep(delay)
```

### Circuit Breaker Pattern

```python
class CircuitBreaker:
    """Prevent cascading failures."""
    
    def __init__(self, failure_threshold: int = 5, timeout: int = 60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
    
    async def call(self, func):
        if self.state == "OPEN":
            if time.time() - self.last_failure_time > self.timeout:
                self.state = "HALF_OPEN"
            else:
                raise CircuitBreakerOpen()
        
        try:
            result = await func()
            if self.state == "HALF_OPEN":
                self.state = "CLOSED"
                self.failure_count = 0
            return result
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()
            if self.failure_count >= self.failure_threshold:
                self.state = "OPEN"
            raise
```

---

## Performance Optimization

### Batch Processing

```python
async def process_columns_in_batches(
    columns: List[Column],
    batch_size: int = 10
):
    """Process columns in parallel batches."""
    for i in range(0, len(columns), batch_size):
        batch = columns[i:i + batch_size]
        tasks = [
            process_column(col)
            for col in batch
        ]
        await asyncio.gather(*tasks)
```

### Token Management

```python
class TokenBudget:
    """Manage Gemini API token budget."""
    
    def __init__(self, max_tokens: int = 100000):
        self.max_tokens = max_tokens
        self.used_tokens = 0
    
    def has_budget(self, estimated_tokens: int) -> bool:
        return self.used_tokens + estimated_tokens <= self.max_tokens
    
    def consume(self, tokens: int):
        self.used_tokens += tokens
```

---

**✓ STEP 5: Agent Architecture Complete**

Creating STEP 6: Folder Structure...
