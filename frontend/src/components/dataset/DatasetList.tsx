import { ReactNode } from 'react'
import DatasetCard from './DatasetCard'
import { Dataset } from '@/services/datasetService'

interface DatasetListProps {
  datasets: Dataset[]
  loading?: boolean
  onSelect?: (id: number) => void
  emptyState?: ReactNode
}

export default function DatasetList({ datasets, loading, onSelect, emptyState }: DatasetListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (datasets.length === 0) {
    return emptyState || (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No datasets found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {datasets.map((dataset) => (
        <DatasetCard key={dataset.id} dataset={dataset} onSelect={onSelect} />
      ))}
    </div>
  )
}
