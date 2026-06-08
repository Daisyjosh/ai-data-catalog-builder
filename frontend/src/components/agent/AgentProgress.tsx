import { Play, Pause, StopCircle } from 'lucide-react'
import { AgentRun } from '@/services/agentService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatDuration } from '@/utils/format'

interface AgentProgressProps {
  run: AgentRun
  onPause?: () => void
  onResume?: () => void
  onCancel?: () => void
}

export default function AgentProgress({ run, onPause, onResume, onCancel }: AgentProgressProps) {
  const progress = run.total_columns_processed > 0
    ? Math.round((run.total_metadata_generated / run.total_columns_processed) * 100)
    : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Running': return 'bg-blue-100 text-blue-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Failed': return 'bg-red-100 text-red-800'
      case 'Paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Agent Execution</CardTitle>
            <CardDescription>Run #{run.id}</CardDescription>
          </div>
          <Badge className={getStatusColor(run.status)}>
            {run.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Tables Processed</p>
            <p className="text-2xl font-bold">{run.total_tables_processed}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Metadata Generated</p>
            <p className="text-2xl font-bold">{run.total_metadata_generated}</p>
          </div>
        </div>

        {/* Duration */}
        {run.duration_seconds && (
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-medium">{formatDuration(run.duration_seconds)}</p>
          </div>
        )}

        {/* Error */}
        {run.error_message && (
          <div className="bg-destructive/10 border border-destructive/20 rounded p-3">
            <p className="text-sm text-destructive">{run.error_message}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {run.status === 'Running' && (
            <Button variant="outline" size="sm" onClick={onPause}>
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </Button>
          )}
          {run.status === 'Paused' && (
            <Button variant="outline" size="sm" onClick={onResume}>
              <Play className="w-4 h-4 mr-1" />
              Resume
            </Button>
          )}
          {(run.status === 'Running' || run.status === 'Paused') && (
            <Button variant="outline" size="sm" className="text-destructive" onClick={onCancel}>
              <StopCircle className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
