'use client'

import { useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Download, Loader2, Maximize2, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ResizeImagePage() {
  const [image, setImage] = useState<{ file: File; url: string } | null>(null)
  const [resizedCanvas, setResizedCanvas] = useState<HTMLCanvasElement | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resizeMode, setResizeMode] = useState<'dimensions' | 'percentage'>('dimensions')
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [percentage, setPercentage] = useState(100)
  const [maintainAspect, setMaintainAspect] = useState(true)
  const [originalSize, setOriginalSize] = useState<{ width: number; height: number } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setOriginalSize({ width: img.width, height: img.height })
      setWidth(img.width)
      setHeight(img.height)
      setImage({ file, url })
      processImage(file, img.width, img.height)
    }
    img.src = url
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'] },
    multiple: false,
  })

  const processImage = async (file: File, targetWidth: number, targetHeight: number) => {
    setIsProcessing(true)
    try {
      const img = new Image()
      const url = URL.createObjectURL(file)
      
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = url
      })

      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext('2d')!
      
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
      setResizedCanvas(canvas)
      
      URL.revokeObjectURL(url)
      toast.success('Image resized successfully!')
    } catch (error) {
      console.error('Error processing image:', error)
      toast.error('Failed to process image')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleResize = () => {
    if (!image) return
    
    let targetWidth = width
    let targetHeight = height

    if (resizeMode === 'percentage' && originalSize) {
      targetWidth = Math.round(originalSize.width * (percentage / 100))
      targetHeight = maintainAspect 
        ? Math.round(originalSize.height * (percentage / 100))
        : Math.round(originalSize.height * (percentage / 100))
    } else if (maintainAspect && originalSize) {
      const aspectRatio = originalSize.width / originalSize.height
      if (width !== originalSize.width) {
        targetHeight = Math.round(width / aspectRatio)
      } else {
        targetWidth = Math.round(height * aspectRatio)
      }
    }

    processImage(image.file, targetWidth, targetHeight)
  }

  const handleDownload = () => {
    if (!resizedCanvas) {
      toast.error('No image to download')
      return
    }

    resizedCanvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `resized-image-${Date.now()}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Image downloaded!')
      }
    })
  }

  const presetSizes = [
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Post', width: 1200, height: 630 },
    { name: 'Twitter Post', width: 1200, height: 675 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'LinkedIn Post', width: 1200, height: 627 },
  ]

  const applyPreset = (preset: { width: number; height: number }) => {
    setWidth(preset.width)
    setHeight(preset.height)
    if (image) {
      processImage(image.file, preset.width, preset.height)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Resize Image Online</h1>
            <p className="text-muted-foreground">
              Resize images by dimensions or percentage. Maintain aspect ratio with presets for social media.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-primary/30 hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                  {isDragActive ? (
                    <>
                      <Upload className="w-16 h-16 text-primary animate-bounce" />
                      <p className="text-primary font-medium">Drop image here</p>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-16 h-16 text-muted-foreground" />
                      <div>
                        <p className="text-base font-medium mb-2">
                          Drag and drop image here, or click to select
                        </p>
                        <button
                          type="button"
                          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                          onClick={(e) => {
                            e.stopPropagation()
                            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
                            fileInput?.click()
                          }}
                        >
                          Choose File
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {originalSize && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Original Size: {originalSize.width} × {originalSize.height} px
                  </p>
                </div>
              )}
            </div>

            {/* Controls Section */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold">Resize Options</h2>

              {/* Resize Mode */}
              <div>
                <label className="block text-sm font-medium mb-2">Resize Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setResizeMode('dimensions')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      resizeMode === 'dimensions'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    Dimensions
                  </button>
                  <button
                    onClick={() => setResizeMode('percentage')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      resizeMode === 'percentage'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    Percentage
                  </button>
                </div>
              </div>

              {resizeMode === 'dimensions' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Width (px)</label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-background border border-input rounded-lg"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Height (px)</label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-background border border-input rounded-lg"
                        min="1"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Percentage: {percentage}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="500"
                    value={percentage}
                    onChange={(e) => setPercentage(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="maintainAspect"
                  checked={maintainAspect}
                  onChange={(e) => setMaintainAspect(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="maintainAspect" className="text-sm">
                  Maintain Aspect Ratio
                </label>
              </div>

              {/* Presets */}
              <div>
                <label className="block text-sm font-medium mb-2">Quick Presets</label>
                <div className="grid grid-cols-2 gap-2">
                  {presetSizes.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="p-2 text-sm border border-border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleResize}
                disabled={!image || isProcessing}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-5 h-5" />
                    Resize Image
                  </>
                )}
              </button>

              {resizedCanvas && (
                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Resized Image
                </button>
              )}
            </div>
          </div>

          {/* Preview Section */}
          {resizedCanvas && (
            <div className="mt-6 bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <div className="flex justify-center">
                <img
                  src={resizedCanvas.toDataURL()}
                  alt="Resized preview"
                  className="max-w-full h-auto rounded-lg border border-border"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Resized Size: {resizedCanvas.width} × {resizedCanvas.height} px
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

