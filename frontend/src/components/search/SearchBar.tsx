import { Search as SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  searchType?: 'keyword' | 'semantic'
  onSearchTypeChange?: (type: 'keyword' | 'semantic') => void
  loading?: boolean
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  searchType = 'semantic',
  onSearchTypeChange,
  loading,
}: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  return (
    <div className="flex gap-3">
      <Input
        placeholder="Search datasets, tables, columns..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1"
      />
      <Select value={searchType} onValueChange={(v: any) => onSearchTypeChange?.(v)}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="keyword">Keyword Search</SelectItem>
          <SelectItem value="semantic">Semantic Search</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={onSearch} disabled={loading}>
        <SearchIcon className="w-4 h-4 mr-2" />
        {loading ? 'Searching...' : 'Search'}
      </Button>
    </div>
  )
}
