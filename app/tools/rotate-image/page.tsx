'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Download, Loader2, Image as ImageIcon, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RotateImagePage() {
  const [image, setImage] = useState<{ file: File; url: string } | null>(null)
  const [rotatedCanvas, setRotatedCanvas] = useState<HTMLCanvasElement | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [flipHorizontal, setFlipHorizontal] = useState(false)
  const [flipVertical, setFlipVertical] = useState(false)

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    const url = URL.createObjectURL(file)
    setImage({ file, url })
    applyTransformations(file)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'] },
    multiple: false,
  })

  const applyTransformations = async (file: File) => {
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
      const ctx = canvas.getContext('2d')!
      
      // Calculate canvas size based on rotation
      if (rotation === 90 || rotation === 270) {
        canvas.width = img.height
        canvas.height = img.width
      } else {
        canvas.width = img.width
        canvas.height = img.height
      }
      
      ctx.save()
      
      // Move to center
      ctx.translate(canvas.width / 2, canvas.height / 2)
      
      // Apply rotation
      ctx.rotate((rotation * Math.PI) / 180)
      
      // Apply flips
      if (flipHorizontal) {
        ctx.scale(-1, 1)
      }
      if (flipVertical) {
        ctx.scale(1, -1)
      }
      
      // Draw image
      ctx.drawImage(img, -img.width / 2, -img.height / 2)
      ctx.restore()
      
      setRotatedCanvas(canvas)
      toast.success('Transformations applied!')
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error applying transformations:', error)
      toast.error('Failed to apply transformations')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRotation = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360)
    if (image) {
      setTimeout(() => applyTransformations(image.file), 100)
    }
  }

  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    if (direction === 'horizontal') {
      setFlipHorizontal((prev) => !prev)
    } else {
      setFlipVertical((prev) => !prev)
    }
    if (image) {
      setTimeout(() => applyTransformations(image.file), 100)
    }
  }

  const handleDownload = () => {
    if (!rotatedCanvas) {
      toast.error('No processed image to download')
      return
    }

    rotatedCanvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `rotated-image-${Date.now()}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Image downloaded!')
      }
    }, 'image/png')
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Rotate & Flip Image</h1>
            <p className="text-muted-foreground">
              Rotate images 90°, 180°, 270° or flip horizontally/vertically. Batch processing supported.
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
              <h2 className="text-xl font-semibold">Transformations</h2>

              {/* Rotation */}
              <div>
                <label className="block text-sm font-medium mb-2">Rotate</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { degrees: 90, label: '90°' },
                    { degrees: 180, label: '180°' },
                    { degrees: 270, label: '270°' },
                    { degrees: 360, label: 'Reset' },
                  ].map((btn) => (
                    <button
                      key={btn.degrees}
                      onClick={() => handleRotation(btn.degrees === 360 ? -rotation : btn.degrees)}
                      className="p-3 rounded-lg border-2 border-border hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span>{btn.label}</span>
                    </button>
                  ))}
                </div>
                {rotation !== 0 && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Current rotation: {rotation}°
                  </p>
                )}
              </div>

              {/* Flip */}
              <div>
                <label className="block text-sm font-medium mb-2">Flip</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleFlip('horizontal')}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      flipHorizontal
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <FlipHorizontal className="w-4 h-4" />
                    <span>Flip Horizontal</span>
                  </button>
                  <button
                    onClick={() => handleFlip('vertical')}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      flipVertical
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <FlipVertical className="w-4 h-4" />
                    <span>Flip Vertical</span>
                  </button>
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={() => {
                  setRotation(0)
                  setFlipHorizontal(false)
                  setFlipVertical(false)
                  if (image) {
                    setTimeout(() => applyTransformations(image.file), 100)
                  }
                }}
                className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Reset All
              </button>

              {rotatedCanvas && (
                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Transformed Image
                </button>
              )}
            </div>
          </div>

          {/* Preview Section */}
          {rotatedCanvas && image && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Original</h3>
                <div className="flex justify-center">
                  <img
                    src={image.url}
                    alt="Original"
                    className="max-w-full h-auto rounded-lg border border-border"
                  />
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Transformed</h3>
                <div className="flex justify-center">
                  <img
                    src={rotatedCanvas.toDataURL()}
                    alt="Transformed"
                    className="max-w-full h-auto rounded-lg border border-border"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

