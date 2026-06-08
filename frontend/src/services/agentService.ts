import api from './api'
import API_ENDPOINTS from '@/utils/api'

export interface AgentRun {
  id: number
  dataset_id: number
  status: 'Running' | 'Completed' | 'Failed' | 'Paused'
  started_at: string
  completed_at?: string
  duration_seconds?: number
  total_tables_processed: number
  total_columns_processed: number
  total_metadata_generated: number
  error_message?: string
}

export interface AgentLog {
  id: number
  agent_run_id: number
  log_level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR'
  message: string
  context?: Record<string, any>
  timestamp: string
}

export interface PaginatedResponse<T> {
  total: number
  items: T[]
}

export async function startAgentRun(datasetId: number): Promise<AgentRun> {
  const response = await api.post(API_ENDPOINTS.AGENT_RUN, {
    dataset_id: datasetId,
  })
  return response.data
}

export async function getAgentRuns(
  status?: string,
  limit: number = 20,
  offset: number = 0
): Promise<PaginatedResponse<AgentRun>> {
  const response = await api.get(API_ENDPOINTS.AGENT_RUNS, {
    params: { status, limit, offset },
  })
  return response.data
}

export async function getAgentRun(id: number): Promise<AgentRun> {
  const response = await api.get(API_ENDPOINTS.AGENT_RUN_DETAIL(id))
  return response.data
}

export async function getAgentLogs(
  agentRunId: number,
  logLevel?: string,
  limit: number = 50,
  offset: number = 0
): Promise<PaginatedResponse<AgentLog>> {
  const response = await api.get(API_ENDPOINTS.AGENT_RUN_LOGS(agentRunId), {
    params: { log_level: logLevel, limit, offset },
  })
  return response.data
}

export async function pauseAgentRun(id: number): Promise<AgentRun> {
  const response = await api.post(API_ENDPOINTS.AGENT_RUN_PAUSE(id))
  return response.data
}

export async function resumeAgentRun(id: number): Promise<AgentRun> {
  const response = await api.post(API_ENDPOINTS.AGENT_RUN_RESUME(id))
  return response.data
}

export async function cancelAgentRun(id: number): Promise<void> {
  await api.delete(API_ENDPOINTS.AGENT_RUN_DELETE(id))
}
