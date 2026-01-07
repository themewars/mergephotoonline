'use client'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { MergeTool } from '@/components/MergeTool'
import { ThemeToggle } from '@/components/ThemeToggle'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <Breadcrumbs />
            <ThemeToggle />
          </div>
          <div className="mt-8">
            <h1 className="text-4xl font-bold mb-2">Merge Images Online</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Combine multiple images into one. Create stunning collages, merge photos horizontally or vertically, 
              and export in high quality - all in your browser, no upload required.
            </p>
            <MergeTool />
          </div>
        </div>
      </main>
    </DndProvider>
  )
}

