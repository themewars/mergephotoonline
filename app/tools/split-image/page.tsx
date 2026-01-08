'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Download, Loader2, Image as ImageIcon, Scissors } from 'lucide-react'
import toast from 'react-hot-toast'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export default function SplitImagePage() {
  const [image, setImage] = useState<{ file: File; url: string } | null>(null)
  const [splitParts, setSplitParts] = useState<HTMLCanvasElement[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [splitMode, setSplitMode] = useState<'grid' | 'rows' | 'columns'>('grid')
  const [rows, setRows] = useState(2)
  const [columns, setColumns] = useState(2)

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    const url = URL.createObjectURL(file)
    setImage({ file, url })
    splitImage(file)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'] },
    multiple: false,
  })

  const splitImage = async (file: File) => {
    setIsProcessing(true)
    try {
      const img = new Image()
      const url = URL.createObjectURL(file)
      
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = url
      })

      const parts: HTMLCanvasElement[] = []
      const partWidth = img.width / columns
      const partHeight = img.height / rows

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const canvas = document.createElement('canvas')
          canvas.width = partWidth
          canvas.height = partHeight
          const ctx = canvas.getContext('2d')!
          
          ctx.drawImage(
            img,
            col * partWidth,
            row * partHeight,
            partWidth,
            partHeight,
            0,
            0,
            partWidth,
            partHeight
          )
          
          parts.push(canvas)
        }
      }
      
      setSplitParts(parts)
      toast.success(`Image split into ${parts.length} parts!`)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error splitting image:', error)
      toast.error('Failed to split image')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSplit = () => {
    if (image) {
      splitImage(image.file)
    }
  }

  const handleDownloadAll = async () => {
    if (splitParts.length === 0) {
      toast.error('No split parts to download')
      return
    }

    try {
      const zip = new JSZip()
      
      for (let i = 0; i < splitParts.length; i++) {
        const canvas = splitParts[i]
        canvas.toBlob((blob) => {
          if (blob) {
            zip.file(`split-part-${i + 1}.png`, blob)
            if (i === splitParts.length - 1) {
              zip.generateAsync({ type: 'blob' }).then((zipBlob) => {
                saveAs(zipBlob, `split-image-${Date.now()}.zip`)
                toast.success('All parts downloaded as ZIP!')
              })
            }
          }
        })
      }
    } catch (error) {
      console.error('Error creating ZIP:', error)
      toast.error('Failed to create ZIP file')
    }
  }

  const handleDownloadSingle = (index: number) => {
    const canvas = splitParts[index]
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `split-part-${index + 1}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Part downloaded!')
      }
    })
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Split Image Online</h1>
            <p className="text-muted-foreground">
              Split images into multiple parts. Create grid splits for Instagram posts or collages.
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
              <h2 className="text-xl font-semibold">Split Settings</h2>

              {/* Grid Settings */}
              <div>
                <label className="block text-sm font-medium mb-2">Split into Grid</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Rows</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={rows}
                      onChange={(e) => setRows(parseInt(e.target.value) || 2)}
                      className="w-full px-3 py-2 bg-background border border-input rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Columns</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={columns}
                      onChange={(e) => setColumns(parseInt(e.target.value) || 2)}
                      className="w-full px-3 py-2 bg-background border border-input rounded-lg"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total parts: {rows * columns}
                </p>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-sm font-medium mb-2">Quick Presets</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { rows: 2, cols: 2, name: '2×2' },
                    { rows: 3, cols: 3, name: '3×3' },
                    { rows: 2, cols: 3, name: '2×3' },
                    { rows: 3, cols: 2, name: '3×2' },
                    { rows: 4, cols: 4, name: '4×4' },
                    { rows: 1, cols: 3, name: '1×3' },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        setRows(preset.rows)
                        setColumns(preset.cols)
                      }}
                      className="p-2 text-sm border border-border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSplit}
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
                    <Scissors className="w-5 h-5" />
                    Split Image
                  </>
                )}
              </button>

              {splitParts.length > 0 && (
                <button
                  onClick={handleDownloadAll}
                  className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download All as ZIP
                </button>
              )}
            </div>
          </div>

          {/* Split Parts Preview */}
          {splitParts.length > 0 && (
            <div className="mt-6 bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Split Parts ({splitParts.length} total)</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {splitParts.map((canvas, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={canvas.toDataURL()}
                      alt={`Part ${index + 1}`}
                      className="w-full h-auto rounded-lg border border-border"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      Part {index + 1}
                    </div>
                    <button
                      onClick={() => handleDownloadSingle(index)}
                      className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Download this part"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

