'use client'

import { useMergeStore } from '@/lib/store'
import { X, GripVertical } from 'lucide-react'
import { useDrag, useDrop } from 'react-dnd'
import { useState, useCallback } from 'react'

interface ImageItemProps {
  image: { id: string; url: string; file: File }
  index: number
}

function ImageItem({ image, index }: ImageItemProps) {
  const { removeImage, reorderImages } = useMergeStore()
  const [isHovered, setIsHovered] = useState(false)

  const [{ isDragging }, drag] = useDrag({
    type: 'image',
    item: { id: image.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'image',
    hover: (draggedItem: { id: string; index: number }) => {
      if (draggedItem.index !== index) {
        reorderImages(draggedItem.index, index)
        draggedItem.index = index
      }
    },
  })

  const setRef = useCallback(
    (node: HTMLDivElement | null): void => {
      drag(drop(node))
    },
    [drag, drop]
  )

  return (
    <div
      ref={setRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative group bg-secondary rounded-lg overflow-hidden border-2 transition-all
        ${isDragging ? 'opacity-50 border-primary' : 'border-transparent'}
        ${isHovered ? 'border-primary/50' : ''}
      `}
    >
      <div className="aspect-square relative">
        <img
          src={image.url}
          alt={`Image ${index + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <GripVertical className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <button
        onClick={() => removeImage(image.id)}
        className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
        title="Remove image"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 text-center">
        {index + 1}
      </div>
    </div>
  )
}

export function ImageList() {
  const { images } = useMergeStore()

  if (images.length === 0) return null

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Images ({images.length})
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto">
        {images.map((image, index) => (
          <ImageItem key={image.id} image={image} index={index} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Drag images to reorder
      </p>
    </div>
  )
}

