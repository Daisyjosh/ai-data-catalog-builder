import api from './api'
import API_ENDPOINTS from '@/utils/api'

export interface SearchQuery {
  query: string
  search_type: 'keyword' | 'semantic'
  limit?: number
  offset?: number
  filters?: Record<string, any>
}

export interface SearchResult {
  column_id: number
  column_name: string
  table_name: string
  dataset_name: string
  similarity_score?: number
  metadata?: any
}

export interface SearchResponse {
  query: string
  search_type: string
  total_results: number
  results: SearchResult[]
  execution_time_ms: number
}

export async function search(params: SearchQuery): Promise<SearchResponse> {
  const response = await api.post(API_ENDPOINTS.SEARCH, params)
  return response.data
}

export async function getSuggestions(query: string, limit: number = 5): Promise<string[]> {
  const response = await api.get(API_ENDPOINTS.SEARCH_SUGGEST, {
    params: { q: query, limit },
  })
  return response.data.suggestions
}
