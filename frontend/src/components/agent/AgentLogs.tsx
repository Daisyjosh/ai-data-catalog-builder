import { AgentLog } from '@/services/agentService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatTime } from '@/utils/format'

interface AgentLogsProps {
  logs: AgentLog[]
  loading?: boolean
}

const getLogLevelColor = (level: string) => {
  switch (level) {
    case 'DEBUG': return 'bg-gray-100 text-gray-800'
    case 'INFO': return 'bg-blue-100 text-blue-800'
    case 'WARNING': return 'bg-yellow-100 text-yellow-800'
    case 'ERROR': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function AgentLogs({ logs, loading }: AgentLogsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Execution Logs</CardTitle>
        <CardDescription>Agent execution details</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 border rounded-md">
          <div className="space-y-2 p-4">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Loading logs...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No logs available</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex gap-3 text-sm py-2 border-b last:border-0">
                  <Badge className={getLogLevelColor(log.log_level)} variant="outline">
                    {log.log_level}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">{log.message}</p>
                    <p className="text-xs text-muted-foreground">{formatTime(log.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
