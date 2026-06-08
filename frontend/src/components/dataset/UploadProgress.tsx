import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface UploadProgressProps {
  fileName?: string
  progress?: number
  status?: 'idle' | 'uploading' | 'complete' | 'error'
  error?: string
}

export default function UploadProgress({
  fileName,
  progress = 0,
  status = 'idle',
  error,
}: UploadProgressProps) {
  if (status === 'idle') return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Upload className="w-4 h-4" />
              {fileName || 'Uploading...'}
            </CardTitle>
            <CardDescription>Upload in progress</CardDescription>
          </div>
          <Badge variant={status === 'complete' ? 'default' : status === 'error' ? 'destructive' : 'secondary'}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{progress}%</span>
            {error && <span className="text-destructive">{error}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
