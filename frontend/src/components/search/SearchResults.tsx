import { SearchResult } from '@/services/searchService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/utils/format'

interface SearchResultsProps {
  results: SearchResult[]
  loading?: boolean
  totalResults?: number
  executionTime?: number
}

export default function SearchResults({
  results,
  loading,
  totalResults = 0,
  executionTime = 0,
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No results found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {executionTime > 0 && (
        <div className="text-sm text-muted-foreground">
          Found {totalResults} results in {executionTime}ms
        </div>
      )}
      <div className="space-y-3">
        {results.map((result) => (
          <Card key={result.column_id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">{result.column_name}</CardTitle>
                  <CardDescription>
                    {result.dataset_name} → {result.table_name}
                  </CardDescription>
                </div>
                {result.similarity_score && (
                  <Badge variant="secondary">
                    {Math.round(result.similarity_score * 100)}% match
                  </Badge>
                )}
              </div>
            </CardHeader>
            {result.metadata && (
              <CardContent>
                <div className="space-y-2 text-sm">
                  {result.metadata.business_description && (
                    <div>
                      <span className="text-muted-foreground">Description:</span>
                      <p className="font-medium">{result.metadata.business_description}</p>
                    </div>
                  )}
                  {result.metadata.tags && result.metadata.tags.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Tags:</span>
                      <div className="flex gap-2 mt-1">
                        {result.metadata.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
