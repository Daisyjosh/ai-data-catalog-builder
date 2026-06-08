import api from './api'
import API_ENDPOINTS from '@/utils/api'

export interface DashboardMetrics {
  total_datasets: number
  total_tables: number
  total_columns: number
  metadata_generated: number
  metadata_pending: number
  agent_runs_total: number
  agent_runs_running: number
  agent_runs_failed: number
  search_count_today: number
  recent_uploads: any[]
  recent_agent_runs: any[]
  processing_status: Record<string, number>
}

export interface ActivityLog {
  id: number
  action: string
  entity_type: string
  timestamp: string
  details?: Record<string, any>
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const response = await api.get(API_ENDPOINTS.DASHBOARD_METRICS)
  return response.data
}

export async function getActivityLogs(limit: number = 20): Promise<{ total: number; items: ActivityLog[] }> {
  const response = await api.get(API_ENDPOINTS.DASHBOARD_ACTIVITY, {
    params: { limit },
  })
  return response.data
}
