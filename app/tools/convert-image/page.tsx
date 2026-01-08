'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Download, Loader2, Image as ImageIcon, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ConvertImagePage() {
  const [image, setImage] = useState<{ file: File; url: string } | null>(null)
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpg' | 'webp' | 'gif'>('png')
  const [quality, setQuality] = useState(0.92)

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    const url = URL.createObjectURL(file)
    setImage({ file, url })
    convertImage(file)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'] },
    multiple: false,
  })

  const convertImage = async (file: File) => {
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

      const mimeType = outputFormat === 'jpg' ? 'image/jpeg' : `image/${outputFormat}`
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setConvertedBlob(blob)
            toast.success(`Image converted to ${outputFormat.toUpperCase()}!`)
          }
        },
        mimeType,
        quality
      )
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error converting image:', error)
      toast.error('Failed to convert image')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFormatChange = (newFormat: 'png' | 'jpg' | 'webp' | 'gif') => {
    setOutputFormat(newFormat)
    if (image) {
      convertImage(image.file)
    }
  }

  const handleDownload = () => {
    if (!convertedBlob) {
      toast.error('No converted image to download')
      return
    }

    const url = URL.createObjectURL(convertedBlob)
    const a = document.createElement('a')
    a.href = url
    const extension = outputFormat === 'jpg' ? 'jpg' : outputFormat
    a.download = `converted-image-${Date.now()}.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Image downloaded!')
  }

  const getOriginalFormat = () => {
    if (!image) return ''
    const ext = image.file.name.split('.').pop()?.toLowerCase() || ''
    return ext.toUpperCase()
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Convert Image Format</h1>
            <p className="text-muted-foreground">
              Convert images between PNG, JPG, WebP, GIF formats. Batch conversion with quality control.
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

              {image && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Original Format: <strong>{getOriginalFormat()}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Controls Section */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold">Conversion Settings</h2>

              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Convert To</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['png', 'jpg', 'webp', 'gif'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleFormatChange(fmt)}
                      className={`p-3 rounded-lg border-2 transition-all uppercase ${
                        outputFormat === fmt
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Slider (for JPG and WebP) */}
              {(outputFormat === 'jpg' || outputFormat === 'webp') && (
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
                    onChange={(e) => {
                      setQuality(parseFloat(e.target.value))
                      if (image) {
                        convertImage(image.file)
                      }
                    }}
                    className="w-full"
                  />
                </div>
              )}

              {convertedBlob && (
                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download {outputFormat.toUpperCase()} Image
                </button>
              )}
            </div>
          </div>

          {/* Preview Section */}
          {convertedBlob && image && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Original ({getOriginalFormat()})</h3>
                <div className="flex justify-center">
                  <img
                    src={image.url}
                    alt="Original"
                    className="max-w-full h-auto rounded-lg border border-border"
                  />
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Converted ({outputFormat.toUpperCase()})</h3>
                <div className="flex justify-center">
                  <img
                    src={URL.createObjectURL(convertedBlob)}
                    alt="Converted"
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

