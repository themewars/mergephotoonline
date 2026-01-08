'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Download, Loader2, Image as ImageIcon, Type } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AddWatermarkPage() {
  const [image, setImage] = useState<{ file: File; url: string } | null>(null)
  const [watermarkedCanvas, setWatermarkedCanvas] = useState<HTMLCanvasElement | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [watermarkText, setWatermarkText] = useState('Your Watermark')
  const [watermarkPosition, setWatermarkPosition] = useState<'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('center')
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.5)
  const [watermarkSize, setWatermarkSize] = useState(48)
  const [watermarkColor, setWatermarkColor] = useState('#ffffff')

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    const url = URL.createObjectURL(file)
    setImage({ file, url })
    applyWatermark(file)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'] },
    multiple: false,
  })

  const applyWatermark = async (file: File) => {
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
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      
      ctx.drawImage(img, 0, 0)
      
      // Add watermark text
      ctx.font = `bold ${watermarkSize}px Arial`
      ctx.fillStyle = watermarkColor
      ctx.globalAlpha = watermarkOpacity
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      let x = canvas.width / 2
      let y = canvas.height / 2
      
      switch (watermarkPosition) {
        case 'top-left':
          x = 50
          y = 50
          ctx.textAlign = 'left'
          ctx.textBaseline = 'top'
          break
        case 'top-right':
          x = canvas.width - 50
          y = 50
          ctx.textAlign = 'right'
          ctx.textBaseline = 'top'
          break
        case 'bottom-left':
          x = 50
          y = canvas.height - 50
          ctx.textAlign = 'left'
          ctx.textBaseline = 'bottom'
          break
        case 'bottom-right':
          x = canvas.width - 50
          y = canvas.height - 50
          ctx.textAlign = 'right'
          ctx.textBaseline = 'bottom'
          break
        default: // center
          x = canvas.width / 2
          y = canvas.height / 2
          break
      }
      
      ctx.fillText(watermarkText, x, y)
      ctx.globalAlpha = 1
      
      setWatermarkedCanvas(canvas)
      toast.success('Watermark added successfully!')
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error adding watermark:', error)
      toast.error('Failed to add watermark')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleWatermarkChange = () => {
    if (image) {
      applyWatermark(image.file)
    }
  }

  const handleDownload = () => {
    if (!watermarkedCanvas) {
      toast.error('No watermarked image to download')
      return
    }

    watermarkedCanvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `watermarked-${Date.now()}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Image downloaded!')
      }
    }, 'image/png')
  }

  const positions = [
    { value: 'center', label: 'Center' },
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
  ]

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Add Watermark to Image</h1>
            <p className="text-muted-foreground">
              Add text or image watermarks to protect your photos. Customize position, opacity, and size.
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
              <h2 className="text-xl font-semibold">Watermark Settings</h2>

              {/* Watermark Text */}
              <div>
                <label className="block text-sm font-medium mb-2">Watermark Text</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => {
                    setWatermarkText(e.target.value)
                    if (image) {
                      setTimeout(() => applyWatermark(image.file), 300)
                    }
                  }}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg"
                  placeholder="Enter watermark text"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium mb-2">Position</label>
                <div className="grid grid-cols-3 gap-2">
                  {positions.map((pos) => (
                    <button
                      key={pos.value}
                      onClick={() => {
                        setWatermarkPosition(pos.value as any)
                        if (image) {
                          setTimeout(() => applyWatermark(image.file), 300)
                        }
                      }}
                      className={`p-2 rounded-lg border-2 transition-all text-sm ${
                        watermarkPosition === pos.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Size: {watermarkSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="120"
                  value={watermarkSize}
                  onChange={(e) => {
                    setWatermarkSize(parseInt(e.target.value))
                    if (image) {
                      setTimeout(() => applyWatermark(image.file), 300)
                    }
                  }}
                  className="w-full"
                />
              </div>

              {/* Opacity */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Opacity: {Math.round(watermarkOpacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.01"
                  value={watermarkOpacity}
                  onChange={(e) => {
                    setWatermarkOpacity(parseFloat(e.target.value))
                    if (image) {
                      setTimeout(() => applyWatermark(image.file), 300)
                    }
                  }}
                  className="w-full"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={watermarkColor}
                    onChange={(e) => {
                      setWatermarkColor(e.target.value)
                      if (image) {
                        setTimeout(() => applyWatermark(image.file), 300)
                      }
                    }}
                    className="w-12 h-10 rounded-lg border border-input cursor-pointer"
                  />
                  <input
                    type="text"
                    value={watermarkColor}
                    onChange={(e) => {
                      setWatermarkColor(e.target.value)
                      if (image) {
                        setTimeout(() => applyWatermark(image.file), 300)
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-background border border-input rounded-lg"
                  />
                </div>
              </div>

              {watermarkedCanvas && (
                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Watermarked Image
                </button>
              )}
            </div>
          </div>

          {/* Preview Section */}
          {watermarkedCanvas && image && (
            <div className="mt-6 bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <div className="flex justify-center">
                <img
                  src={watermarkedCanvas.toDataURL()}
                  alt="Watermarked"
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

