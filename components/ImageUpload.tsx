'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useMergeStore } from '@/lib/store'
import { createImageData } from '@/lib/imageProcessor'
import { Upload, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export function ImageUpload() {
  const { addImage, images } = useMergeStore()
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      toast.error('Please select valid image files')
      return
    }

    try {
      for (const file of imageFiles) {
        const imageData = await createImageData(file)
        addImage(imageData)
      }
      toast.success(`${imageFiles.length} image(s) added successfully`)
    } catch (error) {
      console.error('Error loading images:', error)
      toast.error('Failed to load some images')
    }
  }, [addImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp']
    },
    multiple: true,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      onDrop(Array.from(files))
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Upload Images</label>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive || isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-accent/50'
          }
        `}
      >
        <input {...getInputProps()} onChange={handleFileSelect} />
        <div className="flex flex-col items-center gap-3">
          {isDragActive || isDragging ? (
            <>
              <Upload className="w-12 h-12 text-primary animate-bounce" />
              <p className="text-primary font-medium">Drop images here</p>
            </>
          ) : (
            <>
              <ImageIcon className="w-12 h-12 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium mb-1">
                  Drag & drop images here, or click to select
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports PNG, JPG, GIF, WebP, BMP
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      {images.length > 0 && (
        <p className="text-xs text-muted-foreground mt-2">
          {images.length} image(s) loaded
        </p>
      )}
    </div>
  )
}

