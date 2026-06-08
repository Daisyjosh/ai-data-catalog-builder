const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const API_ENDPOINTS = {
  // Datasets
  DATASETS_LIST: `${API_BASE_URL}/datasets`,
  DATASETS_UPLOAD: `${API_BASE_URL}/datasets/upload`,
  DATASETS_DETAIL: (id: number) => `${API_BASE_URL}/datasets/${id}`,
  DATASETS_UPDATE: (id: number) => `${API_BASE_URL}/datasets/${id}`,
  DATASETS_DELETE: (id: number) => `${API_BASE_URL}/datasets/${id}`,
  DATASETS_TABLES: (datasetId: number) => `${API_BASE_URL}/datasets/${datasetId}/tables`,

  // Tables
  TABLES_DETAIL: (id: number) => `${API_BASE_URL}/tables/${id}`,
  TABLES_COLUMNS: (tableId: number) => `${API_BASE_URL}/tables/${tableId}/columns`,

  // Columns
  COLUMNS_DETAIL: (id: number) => `${API_BASE_URL}/columns/${id}`,

  // Metadata
  METADATA_GET: (columnId: number) => `${API_BASE_URL}/metadata/${columnId}`,
  METADATA_REGENERATE: (columnId: number) => `${API_BASE_URL}/metadata/regenerate/${columnId}`,

  // Search
  SEARCH: `${API_BASE_URL}/search`,
  SEARCH_SUGGEST: `${API_BASE_URL}/search/suggest`,

  // Agent
  AGENT_RUN: `${API_BASE_URL}/agent/run`,
  AGENT_RUNS: `${API_BASE_URL}/agent/runs`,
  AGENT_RUN_DETAIL: (id: number) => `${API_BASE_URL}/agent/runs/${id}`,
  AGENT_RUN_LOGS: (id: number) => `${API_BASE_URL}/agent/runs/${id}/logs`,
  AGENT_RUN_PAUSE: (id: number) => `${API_BASE_URL}/agent/runs/${id}/pause`,
  AGENT_RUN_RESUME: (id: number) => `${API_BASE_URL}/agent/runs/${id}/resume`,
  AGENT_RUN_DELETE: (id: number) => `${API_BASE_URL}/agent/runs/${id}`,

  // Dashboard
  DASHBOARD_METRICS: `${API_BASE_URL}/dashboard/metrics`,
  DASHBOARD_ACTIVITY: `${API_BASE_URL}/dashboard/activity`,

  // Health
  HEALTH: `${API_BASE_URL}/../health`,

  // MCP
  MCP_TOOLS: `${API_BASE_URL}/mcp/tools`,
  MCP_EXECUTE: `${API_BASE_URL}/mcp/execute`,
}

export default API_ENDPOINTS
