import { useEffect, useState } from 'react'
import { useAgentStore } from '@/store/agentStore'
import { getAgentRun, getAgentLogs, AgentRun } from '@/services/agentService'

export function useAgent() {
  const { currentRun, loading, error, setCurrentRun, setLoading, setError, updateRun } = useAgentStore()
  const [logs, setLogs] = useState<any[]>([])

  const fetchAgentRun = async (id: number) => {
    try {
      setLoading(true)
      const run = await getAgentRun(id)
      setCurrentRun(run)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchLogs = async (agentRunId: number) => {
    try {
      const response = await getAgentLogs(agentRunId)
      setLogs(response.items)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return {
    currentRun,
    loading,
    error,
    logs,
    fetchAgentRun,
    fetchLogs,
  }
}
