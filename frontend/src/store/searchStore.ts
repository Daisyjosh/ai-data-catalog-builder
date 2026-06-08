import { create } from 'zustand'
import { SearchResult } from '@/services/searchService'

interface SearchState {
  results: SearchResult[]
  query: string
  loading: boolean
  error: string | null
  total: number
  page: number
  pageSize: number
  setResults: (results: SearchResult[], total: number) => void
  setQuery: (query: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  results: [],
  query: '',
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 20,
  setResults: (results, total) => set({ results, total }),
  setQuery: (query) => set({ query }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize }),
}))
