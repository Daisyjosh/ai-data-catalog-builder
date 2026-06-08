import api from './api'
import API_ENDPOINTS from '@/utils/api'

export interface Dataset {
  id: number
  name: string
  description?: string
  source_type: string
  file_size_bytes: number
  row_count?: number
  metadata_generated: boolean
  table_count?: number
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  total: number
  page: number
  page_size: number
  items: T[]
}

export async function getDatasets(page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<Dataset>> {
  const response = await api.get(API_ENDPOINTS.DATASETS_LIST, {
    params: { page, page_size: pageSize },
  })
  return response.data
}

export async function getDataset(id: number): Promise<Dataset> {
  const response = await api.get(API_ENDPOINTS.DATASETS_DETAIL(id))
  return response.data
}

export async function uploadDataset(formData: FormData): Promise<Dataset> {
  const response = await api.post(API_ENDPOINTS.DATASETS_UPLOAD, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export async function updateDataset(id: number, data: Partial<Dataset>): Promise<Dataset> {
  const response = await api.put(API_ENDPOINTS.DATASETS_UPDATE(id), data)
  return response.data
}

export async function deleteDataset(id: number): Promise<void> {
  await api.delete(API_ENDPOINTS.DATASETS_DELETE(id))
}
