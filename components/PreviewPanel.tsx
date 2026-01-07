'use client'

import { useMergeStore } from '@/lib/store'
import { useState, useRef, useEffect } from 'react'
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function PreviewPanel({ isGenerating }: { isGenerating: boolean }) {
  const { previewCanvas, images } = useMergeStore()
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [comparisonMode, setComparisonMode] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (previewCanvas) {
      const url = previewCanvas.toDataURL()
      setImageUrl(url)
    } else {
      setImageUrl(null)
    }
  }, [previewCanvas])

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)))
  }

  // Touch gestures for mobile
  const touchStartRef = useRef<{ x: number; y: number; distance: number } | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )
      touchStartRef.current = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
        distance,
      }
    } else if (e.touches.length === 1 && zoom > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartRef.current) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )
      const scale = distance / touchStartRef.current.distance
      setZoom(prev => Math.max(0.5, Math.min(3, prev * scale)))
      touchStartRef.current.distance = distance
    } else if (e.touches.length === 1 && isDragging && zoom > 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      })
    }
  }

  const handleTouchEnd = () => {
    touchStartRef.current = null
    setIsDragging(false)
  }

  if (images.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
        <Eye className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Preview</h3>
        <p className="text-muted-foreground">
          Upload images to see the merged preview here
        </p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-border p-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Preview</h3>
          {isGenerating && (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setComparisonMode(!comparisonMode)}
            className={`p-2 rounded-lg transition-colors ${
              comparisonMode
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
            title="Before/After Comparison"
          >
            {comparisonMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div
        ref={containerRef}
        className="relative bg-muted/30 overflow-hidden touch-none"
        style={{ height: '600px', minHeight: '400px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {comparisonMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            {/* Before */}
            <div className="border-b md:border-b-0 md:border-r border-border p-4 overflow-auto">
              <div className="text-center mb-2 text-sm font-medium text-muted-foreground">
                Before
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {images.map((img, idx) => (
                  <div key={img.id} className="relative">
                    <img
                      src={img.url}
                      alt={`Original ${idx + 1}`}
                      className="max-w-full h-auto rounded border border-border"
                    />
                    <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1 rounded">
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* After */}
            <div className="p-4 overflow-auto flex items-center justify-center">
              <div className="text-center">
                <div className="text-center mb-2 text-sm font-medium text-muted-foreground">
                  After
                </div>
                {imageUrl && (
                  <motion.img
                    src={imageUrl}
                    alt="Merged preview"
                    className="max-w-full h-auto rounded border border-border shadow-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center p-4"
            style={{
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
            }}
          >
            {imageUrl ? (
              <motion.img
                src={imageUrl}
                alt="Merged preview"
                className="max-w-full max-h-full object-contain rounded shadow-lg"
                style={{
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p>Generating preview...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Zoom Info */}
      {!comparisonMode && (
        <div className="border-t border-border p-2 text-center text-xs text-muted-foreground">
          Zoom: {Math.round(zoom * 100)}% {zoom > 1 && '(Drag to pan)'}
        </div>
      )}
    </div>
  )
}

