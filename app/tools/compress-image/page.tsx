'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Download, Loader2, Image as ImageIcon, FileDown } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CompressImagePage() {
  const [image, setImage] = useState<{ file: File; url: string } | null>(null)
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [quality, setQuality] = useState(0.8)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const [format, setFormat] = useState<'jpg' | 'png' | 'webp'>('jpg')

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    const url = URL.createObjectURL(file)
    setImage({ file, url })
    setOriginalSize(file.size)
    compressImage(file)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'] },
    multiple: false,
  })

  const compressImage = async (file: File) => {
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

      const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedBlob(blob)
            setCompressedSize(blob.size)
            const reduction = ((originalSize - blob.size) / originalSize * 100).toFixed(1)
            toast.success(`Image compressed! Size reduced by ${reduction}%`)
          }
        },
        mimeType,
        quality
      )
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error compressing image:', error)
      toast.error('Failed to compress image')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleQualityChange = (newQuality: number) => {
    setQuality(newQuality)
    if (image) {
      compressImage(image.file)
    }
  }

  const handleFormatChange = (newFormat: 'jpg' | 'png' | 'webp') => {
    setFormat(newFormat)
    if (image) {
      compressImage(image.file)
    }
  }

  const handleDownload = () => {
    if (!compressedBlob) {
      toast.error('No compressed image to download')
      return
    }

    const url = URL.createObjectURL(compressedBlob)
    const a = document.createElement('a')
    a.href = url
    const extension = format === 'jpg' ? 'jpg' : format
    a.download = `compressed-image-${Date.now()}.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Image downloaded!')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Compress Image Online</h1>
            <p className="text-muted-foreground">
              Reduce image file size without losing quality. Compress JPG, PNG, WebP images for faster loading.
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

              {originalSize > 0 && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Original Size: <strong>{formatFileSize(originalSize)}</strong>
                  </p>
                  {compressedSize > 0 && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Compressed Size: <strong className="text-green-600">{formatFileSize(compressedSize)}</strong>
                      </p>
                      <p className="text-sm text-primary font-semibold">
                        Saved: {formatFileSize(originalSize - compressedSize)} (
                        {((originalSize - compressedSize) / originalSize * 100).toFixed(1)}%)
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Controls Section */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold">Compression Settings</h2>

              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Output Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['jpg', 'png', 'webp'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleFormatChange(fmt)}
                      className={`p-3 rounded-lg border-2 transition-all uppercase ${
                        format === fmt
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Slider */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.01"
                  value={quality}
                  onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Smaller Size</span>
                  <span>Better Quality</span>
                </div>
              </div>

              {compressedBlob && (
                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Compressed Image
                </button>
              )}
            </div>
          </div>

          {/* Preview Section */}
          {compressedBlob && image && (
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
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  {formatFileSize(originalSize)}
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Compressed</h3>
                <div className="flex justify-center">
                  <img
                    src={URL.createObjectURL(compressedBlob)}
                    alt="Compressed"
                    className="max-w-full h-auto rounded-lg border border-border"
                  />
                </div>
                <p className="text-sm text-green-600 font-semibold mt-4 text-center">
                  {formatFileSize(compressedSize)} ({((originalSize - compressedSize) / originalSize * 100).toFixed(1)}% smaller)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

