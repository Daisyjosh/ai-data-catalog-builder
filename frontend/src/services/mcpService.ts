import api from './api'
import API_ENDPOINTS from '@/utils/api'

export interface MCPTool {
  name: string
  description: string
  inputSchema: Record<string, any>
}

export interface MCPExecuteRequest {
  tool: string
  arguments: Record<string, any>
}

export interface MCPExecuteResponse {
  result: any
  error?: string
}

export async function getMCPTools(): Promise<MCPTool[]> {
  const response = await api.get(API_ENDPOINTS.MCP_TOOLS)
  return response.data.tools || []
}

export async function executeMCPTool(request: MCPExecuteRequest): Promise<MCPExecuteResponse> {
  const response = await api.post(API_ENDPOINTS.MCP_EXECUTE, request)
  return response.data
}
