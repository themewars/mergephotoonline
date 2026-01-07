'use client'

import { useEffect, useRef, useState } from 'react'
import { useMergeStore } from '@/lib/store'
import { ImageUpload } from './ImageUpload'
import { ImageList } from './ImageList'
import { MergeControls } from './MergeControls'
import { PreviewPanel } from './PreviewPanel'
import { mergeImages, canvasToBlob, downloadImage, type MergeOptions } from '@/lib/imageProcessor'
import toast from 'react-hot-toast'
import { Download, Undo2, Redo2, Loader2 } from 'lucide-react'

export function MergeTool() {
  const {
    images,
    options,
    previewCanvas,
    setPreviewCanvas,
    updateOptions,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useMergeStore()

  const [isProcessing, setIsProcessing] = useState(false)
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'webp'>('png')
  const [exportQuality, setExportQuality] = useState(0.92)
  const [isGenerating, setIsGenerating] = useState(false)

  // Generate preview whenever images or options change
  useEffect(() => {
    if (images.length === 0) {
      setPreviewCanvas(null)
      return
    }

    const generatePreview = async () => {
      setIsGenerating(true)
      try {
        const canvas = await mergeImages(images, options)
        setPreviewCanvas(canvas)
      } catch (error) {
        console.error('Error generating preview:', error)
        toast.error('Failed to generate preview')
      } finally {
        setIsGenerating(false)
      }
    }

    const timeoutId = setTimeout(generatePreview, 300)
    return () => clearTimeout(timeoutId)
  }, [images, options, setPreviewCanvas])

  const handleDownload = async () => {
    if (!previewCanvas) {
      toast.error('No image to download')
      return
    }

    setIsProcessing(true)
    try {
      const blob = await canvasToBlob(previewCanvas, exportFormat, exportQuality)
      const extension = exportFormat === 'jpg' ? 'jpg' : exportFormat
      const filename = `merged-image-${Date.now()}.${extension}`
      downloadImage(blob, filename)
      toast.success('Image downloaded successfully!')
    } catch (error) {
      console.error('Error downloading image:', error)
      toast.error('Failed to download image')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      {/* Left Panel - Controls */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Controls</h2>
            <div className="flex gap-2">
              <button
                onClick={undo}
                disabled={!canUndo()}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Undo"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo()}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Redo"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <ImageUpload />

          {images.length > 0 && (
            <>
              <ImageList />
              <MergeControls />
            </>
          )}
        </div>

        {/* Export Settings */}
        {images.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold">Export Settings</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Format</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as 'png' | 'jpg' | 'webp')}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="png">PNG (Transparent)</option>
                <option value="jpg">JPG (Smaller size)</option>
                <option value="webp">WebP (Modern)</option>
              </select>
            </div>

            {exportFormat !== 'png' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quality: {Math.round(exportQuality * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.01"
                  value={exportQuality}
                  onChange={(e) => setExportQuality(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            <button
              onClick={handleDownload}
              disabled={!previewCanvas || isProcessing}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Image
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Right Panel - Preview */}
      <div className="lg:col-span-2">
        <PreviewPanel isGenerating={isGenerating} />
      </div>
    </div>
  )
}

