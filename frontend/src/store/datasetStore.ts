import { create } from 'zustand'
import { Dataset } from '@/services/datasetService'

interface DatasetState {
  datasets: Dataset[]
  loading: boolean
  error: string | null
  selectedDatasetId: number | null
  setDatasets: (datasets: Dataset[]) => void
  addDataset: (dataset: Dataset) => void
  removeDataset: (id: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  selectDataset: (id: number | null) => void
}

export const useDatasetStore = create<DatasetState>((set) => ({
  datasets: [],
  loading: false,
  error: null,
  selectedDatasetId: null,
  setDatasets: (datasets) => set({ datasets }),
  addDataset: (dataset) => set((state) => ({ datasets: [dataset, ...state.datasets] })),
  removeDataset: (id) => set((state) => ({ datasets: state.datasets.filter((d) => d.id !== id) })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  selectDataset: (id) => set({ selectedDatasetId: id }),
}))
