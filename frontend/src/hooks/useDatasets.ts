import { useEffect, useState } from 'react'
import { useDatasetStore } from '@/store/datasetStore'
import { getDatasets, Dataset } from '@/services/datasetService'

export function useDatasets() {
  const { datasets, loading, error, setDatasets, setLoading, setError } = useDatasetStore()
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  useEffect(() => {
    fetchDatasets()
  }, [page, pageSize])

  const fetchDatasets = async () => {
    try {
      setLoading(true)
      const response = await getDatasets(page, pageSize)
      setDatasets(response.items)
      setTotal(response.total)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    datasets,
    loading,
    error,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    refetch: fetchDatasets,
  }
}
