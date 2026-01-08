'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Download, Loader2, Image as ImageIcon, Eraser } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RemoveBackgroundPage() {
  const [image, setImage] = useState<{ file: File; url: string } | null>(null)
  const [processedCanvas, setProcessedCanvas] = useState<HTMLCanvasElement | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    const url = URL.createObjectURL(file)
    setImage({ file, url })
    removeBackground(file)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'] },
    multiple: false,
  })

  const removeBackground = async (file: File) => {
    setIsProcessing(true)
    toast.info('Background removal is processing...')
    
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
      
      // Simple background removal using color threshold
      // Note: This is a basic implementation. For better results, consider using a library like @tensorflow-models/deeplab
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      // Simple white/light background removal
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const brightness = (r + g + b) / 3
        
        // Remove pixels that are very light (white/light background)
        if (brightness > 240) {
          data[i + 3] = 0 // Make transparent
        }
      }
      
      ctx.putImageData(imageData, 0, 0)
      setProcessedCanvas(canvas)
      toast.success('Background removed! (Note: This is a basic removal. For better results, use professional tools)')
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error removing background:', error)
      toast.error('Failed to remove background')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processedCanvas) {
      toast.error('No processed image to download')
      return
    }

    processedCanvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `no-background-${Date.now()}.png`
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
            <h1 className="text-4xl font-bold mb-2">Remove Background</h1>
            <p className="text-muted-foreground">
              Remove image background automatically. Create transparent PNG images instantly.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Note: This tool uses basic background removal. For best results with complex images, consider professional AI tools.
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

            {/* Info Section */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold">How It Works</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    1
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload your image with a light or white background
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    2
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The tool automatically detects and removes the background
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    3
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Download your image with transparent background as PNG
                  </p>
                </div>
              </div>

              {processedCanvas && (
                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Transparent Image
                </button>
              )}
            </div>
          </div>

          {/* Preview Section */}
          {image && processedCanvas && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Original</h3>
                <div className="flex justify-center bg-muted/30 rounded-lg p-4">
                  <img
                    src={image.url}
                    alt="Original"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Background Removed</h3>
                <div className="flex justify-center bg-muted/30 rounded-lg p-4" style={{
                  backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}>
                  <img
                    src={processedCanvas.toDataURL()}
                    alt="Background removed"
                    className="max-w-full h-auto rounded-lg"
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

