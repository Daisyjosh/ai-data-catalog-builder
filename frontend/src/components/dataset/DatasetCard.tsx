import { Upload, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dataset } from '@/services/datasetService'
import { formatFileSize, formatDate } from '@/utils/format'
import { Link } from 'react-router-dom'

interface DatasetCardProps {
  dataset: Dataset
  onSelect?: (id: number) => void
}

export default function DatasetCard({ dataset, onSelect }: DatasetCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {dataset.name}
            </CardTitle>
            <CardDescription className="mt-2">
              {dataset.description || 'No description provided'}
            </CardDescription>
          </div>
          <Badge variant={dataset.metadata_generated ? 'default' : 'secondary'}>
            {dataset.metadata_generated ? 'Complete' : 'Pending'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Type:</span>
              <p className="font-medium">{dataset.source_type}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Size:</span>
              <p className="font-medium">{formatFileSize(dataset.file_size_bytes)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Rows:</span>
              <p className="font-medium">{dataset.row_count?.toLocaleString() || 'N/A'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Tables:</span>
              <p className="font-medium">{dataset.table_count || 0}</p>
            </div>
          </div>
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Created {formatDate(dataset.created_at)}
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <Link to={`/datasets/${dataset.id}`} className="flex-1">
              <Button variant="outline" className="w-full" size="sm">
                View Details
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => onSelect?.(dataset.id)}
            >
              <Upload className="w-4 h-4 mr-1" />
              Use
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
