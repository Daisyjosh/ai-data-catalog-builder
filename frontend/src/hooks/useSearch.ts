import { useEffect, useState } from 'react'
import { useSearchStore } from '@/store/searchStore'
import { search, SearchQuery } from '@/services/searchService'

export function useSearch() {
  const { results, query, loading, error, total, page, setResults, setQuery, setLoading, setError, setPage } = useSearchStore()

  const executeSearch = async (searchParams: SearchQuery) => {
    try {
      setLoading(true)
      setQuery(searchParams.query)
      const response = await search(searchParams)
      setResults(response.results, response.total_results)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    results,
    query,
    loading,
    error,
    total,
    page,
    setPage,
    executeSearch,
  }
}
