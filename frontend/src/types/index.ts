import { AxiosError } from 'axios'

export interface APIError {
  status: number
  error: string
  details?: Array<{
    field?: string
    message: string
    code: string
  }>
}

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

export interface Table {
  id: number
  dataset_id: number
  name: string
  row_count: number
  description?: string
  metadata_generated: boolean
  column_count?: number
  created_at: string
  updated_at: string
}

export interface Column {
  id: number
  table_id: number
  name: string
  data_type: string
  nullable: boolean
  sample_values?: string[]
  metadata_generated: boolean
  created_at: string
  updated_at: string
  metadata?: Metadata
}

export interface Metadata {
  id: number
  column_id: number
  business_description: string
  business_category?: string
  tags?: string[]
  sensitivity_level: string
  embedding_model?: string
  generated_at: string
  generated_by: string
}
