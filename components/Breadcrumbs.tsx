import Link from 'next/link'
import { Home } from 'lucide-react'

export function Breadcrumbs() {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      <Link 
        href="/" 
        className="hover:text-foreground transition-colors flex items-center"
      >
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>
      <span>/</span>
      <Link href="/tools" className="hover:text-foreground transition-colors">
        Tools
      </Link>
      <span>/</span>
      <span className="text-foreground font-medium">Merge Images Online</span>
    </nav>
  )
}

