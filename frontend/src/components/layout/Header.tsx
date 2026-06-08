import { Bell, User, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Header() {
  return (
    <header className="sticky top-0 right-0 left-0 lg:left-64 bg-card border-b border-border z-30">
      <div className="flex items-center justify-between p-4 lg:px-6">
        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Quick search..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Right items */}
        <div className="flex items-center gap-4 ml-auto">
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
