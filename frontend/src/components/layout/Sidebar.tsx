import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Home, Upload, BookOpen, Search, Database, Zap, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/upload', label: 'Upload Dataset', icon: Upload },
    { path: '/catalog', label: 'Catalog', icon: BookOpen },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/agent', label: 'Agent Monitor', icon: Zap },
    { path: '/mcp', label: 'MCP Playground', icon: Database },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 hover:bg-accent rounded-md"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-card border-r border-border transition-transform duration-300 z-40',
          !isOpen && '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary">AI Data Catalog</h1>
          <p className="text-xs text-muted-foreground mt-1">Metadata Generation</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <Button
                variant={isActive(path) ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full justify-start gap-3 text-destructive">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  )
}
