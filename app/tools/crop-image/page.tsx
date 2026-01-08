'use client'

import { useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Download, Loader2, Image as ImageIcon, Crop } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CropImagePage() {
  const [image, setImage] = useState<{ file: File; url: string } | null>(null)
  const [croppedCanvas, setCroppedCanvas] = useState<HTMLCanvasElement | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cropMode, setCropMode] = useState<'free' | 'aspect'>('free')
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setImage({ file, url })
      setCropArea({ x: 0, y: 0, width: img.width, height: img.height })
    }
    img.src = url
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'] },
    multiple: false,
  })

  const aspectRatios = [
    { name: 'Free', value: null },
    { name: 'Square (1:1)', value: 1 },
    { name: '16:9', value: 16 / 9 },
    { name: '4:3', value: 4 / 3 },
    { name: '3:2', value: 3 / 2 },
    { name: '9:16', value: 9 / 16 },
  ]

  const handleCrop = () => {
    if (!image || !canvasRef.current) return

    setIsProcessing(true)
    try {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = cropArea.width
        canvas.height = cropArea.height
        const ctx = canvas.getContext('2d')!
        
        ctx.drawImage(
          img,
          cropArea.x,
          cropArea.y,
          cropArea.width,
          cropArea.height,
          0,
          0,
          cropArea.width,
          cropArea.height
        )
        
        setCroppedCanvas(canvas)
        toast.success('Image cropped successfully!')
      }
      img.src = image.url
    } catch (error) {
      console.error('Error cropping image:', error)
      toast.error('Failed to crop image')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!croppedCanvas) {
      toast.error('No cropped image to download')
      return
    }

    croppedCanvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `cropped-image-${Date.now()}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Image downloaded!')
      }
    })
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Crop Image Online</h1>
            <p className="text-muted-foreground">
              Crop images with free selection or fixed aspect ratios. Perfect for social media posts.
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
            </div>

            {/* Controls Section */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold">Crop Settings</h2>

              {/* Aspect Ratio Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
                <div className="grid grid-cols-2 gap-2">
                  {aspectRatios.map((ratio) => (
                    <button
                      key={ratio.name}
                      onClick={() => {
                        setAspectRatio(ratio.value)
                        setCropMode(ratio.value === null ? 'free' : 'aspect')
                      }}
                      className={`p-3 rounded-lg border-2 transition-all text-sm ${
                        aspectRatio === ratio.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {ratio.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crop Dimensions */}
              {cropArea.width > 0 && (
                <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Crop Area: {Math.round(cropArea.width)} × {Math.round(cropArea.height)} px
                  </p>
                  {aspectRatio && (
                    <p className="text-sm text-muted-foreground">
                      Aspect Ratio: {aspectRatio.toFixed(2)}:1
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={handleCrop}
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
                    <Crop className="w-5 h-5" />
                    Crop Image
                  </>
                )}
              </button>

              {croppedCanvas && (
                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Cropped Image
                </button>
              )}
            </div>
          </div>

          {/* Preview Section */}
          {image && (
            <div className="mt-6 bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Preview & Crop</h2>
              <div className="flex justify-center">
                <div className="relative inline-block">
                  <img
                    src={image.url}
                    alt="Preview"
                    className="max-w-full h-auto rounded-lg border border-border"
                    style={{ maxHeight: '500px' }}
                  />
                  {/* Crop overlay would go here - simplified for now */}
                </div>
              </div>
            </div>
          )}

          {/* Cropped Result */}
          {croppedCanvas && (
            <div className="mt-6 bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Cropped Image</h2>
              <div className="flex justify-center">
                <img
                  src={croppedCanvas.toDataURL()}
                  alt="Cropped"
                  className="max-w-full h-auto rounded-lg border border-border"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

