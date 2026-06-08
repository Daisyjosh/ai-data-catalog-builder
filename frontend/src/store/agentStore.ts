import { create } from 'zustand'
import { AgentRun } from '@/services/agentService'

interface AgentState {
  runs: AgentRun[]
  currentRun: AgentRun | null
  loading: boolean
  error: string | null
  setRuns: (runs: AgentRun[]) => void
  setCurrentRun: (run: AgentRun | null) => void
  addRun: (run: AgentRun) => void
  updateRun: (run: AgentRun) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAgentStore = create<AgentState>((set) => ({
  runs: [],
  currentRun: null,
  loading: false,
  error: null,
  setRuns: (runs) => set({ runs }),
  setCurrentRun: (run) => set({ currentRun: run }),
  addRun: (run) => set((state) => ({ runs: [run, ...state.runs] })),
  updateRun: (run) => set((state) => ({
    runs: state.runs.map((r) => r.id === run.id ? run : r),
    currentRun: state.currentRun?.id === run.id ? run : state.currentRun,
  })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
