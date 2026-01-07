export interface ImageData {
  id: string
  file: File
  url: string
  width: number
  height: number
}

export interface MergeOptions {
  direction: 'horizontal' | 'vertical' | 'grid'
  gridColumns?: number
  gridRows?: number
  autoResize: boolean
  padding: number
  border: {
    enabled: boolean
    type: 'solid' | 'dashed' | 'dotted'
    color: string
    width: number
  }
  backgroundColor: string
  aspectRatio?: {
    width: number
    height: number
  }
}

export interface AspectRatioPreset {
  name: string
  width: number
  height: number
}

export const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  { name: 'Free', width: 0, height: 0 },
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'Facebook Post', width: 1200, height: 630 },
  { name: 'Twitter Post', width: 1200, height: 675 },
  { name: 'Square', width: 1080, height: 1080 },
  { name: '16:9', width: 1920, height: 1080 },
  { name: '4:3', width: 1600, height: 1200 },
  { name: '3:2', width: 1800, height: 1200 },
]

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export async function createImageData(file: File): Promise<ImageData> {
  const url = URL.createObjectURL(file)
  const dimensions = await getImageDimensions(file)
  return {
    id: Math.random().toString(36).substring(7),
    file,
    url,
    width: dimensions.width,
    height: dimensions.height,
  }
}

function hexToRgba(hex: string, alpha: number = 1): string {
  if (hex === 'transparent') return 'rgba(0, 0, 0, 0)'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function drawBorder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  border: MergeOptions['border']
) {
  if (!border.enabled) return

  ctx.save()
  ctx.strokeStyle = border.color
  ctx.lineWidth = border.width
  ctx.setLineDash(
    border.type === 'solid' ? [] : border.type === 'dashed' ? [10, 5] : [2, 2]
  )

  ctx.strokeRect(
    x + border.width / 2,
    y + border.width / 2,
    width - border.width,
    height - border.width
  )
  ctx.restore()
}

export async function mergeImages(
  images: ImageData[],
  options: MergeOptions
): Promise<HTMLCanvasElement> {
  if (images.length === 0) {
    throw new Error('No images to merge')
  }

  const loadedImages = await Promise.all(images.map(img => loadImage(img.url)))

  let canvasWidth = 0
  let canvasHeight = 0
  let imagePositions: Array<{ x: number; y: number; width: number; height: number }> = []

  if (options.direction === 'grid' && options.gridColumns && options.gridRows) {
    // Grid layout
    const cols = options.gridColumns
    const rows = options.gridRows
    const cellWidth = Math.max(...loadedImages.map(img => img.width))
    const cellHeight = Math.max(...loadedImages.map(img => img.height))

    canvasWidth = cols * cellWidth + (cols + 1) * options.padding
    canvasHeight = rows * cellHeight + (rows + 1) * options.padding

    loadedImages.forEach((img, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      const x = col * cellWidth + (col + 1) * options.padding
      const y = row * cellHeight + (row + 1) * options.padding

      let imgWidth = img.width
      let imgHeight = img.height

      if (options.autoResize) {
        const scale = Math.min(cellWidth / img.width, cellHeight / img.height)
        imgWidth = img.width * scale
        imgHeight = img.height * scale
      }

      imagePositions.push({
        x: x + (cellWidth - imgWidth) / 2,
        y: y + (cellHeight - imgHeight) / 2,
        width: imgWidth,
        height: imgHeight,
      })
    })
  } else if (options.direction === 'horizontal') {
    // Horizontal merge
    const maxHeight = Math.max(...loadedImages.map(img => img.height))
    let currentX = options.padding

    loadedImages.forEach((img) => {
      let imgWidth = img.width
      let imgHeight = img.height

      if (options.autoResize) {
        const scale = maxHeight / img.height
        imgWidth = img.width * scale
        imgHeight = maxHeight
      }

      imagePositions.push({
        x: currentX,
        y: options.padding,
        width: imgWidth,
        height: imgHeight,
      })

      currentX += imgWidth + options.padding
    })

    canvasWidth = currentX
    canvasHeight = maxHeight + options.padding * 2
  } else {
    // Vertical merge
    const maxWidth = Math.max(...loadedImages.map(img => img.width))
    let currentY = options.padding

    loadedImages.forEach((img) => {
      let imgWidth = img.width
      let imgHeight = img.height

      if (options.autoResize) {
        const scale = maxWidth / img.width
        imgWidth = maxWidth
        imgHeight = img.height * scale
      }

      imagePositions.push({
        x: options.padding,
        y: currentY,
        width: imgWidth,
        height: imgHeight,
      })

      currentY += imgHeight + options.padding
    })

    canvasWidth = maxWidth + options.padding * 2
    canvasHeight = currentY
  }

  // Apply aspect ratio if specified
  if (options.aspectRatio && options.aspectRatio.width > 0 && options.aspectRatio.height > 0) {
    const targetAspect = options.aspectRatio.width / options.aspectRatio.height
    const currentAspect = canvasWidth / canvasHeight

    if (currentAspect > targetAspect) {
      // Too wide, adjust height
      canvasHeight = canvasWidth / targetAspect
    } else {
      // Too tall, adjust width
      canvasWidth = canvasHeight * targetAspect
    }
  }

  // Add border width to canvas size
  if (options.border.enabled) {
    canvasWidth += options.border.width * 2
    canvasHeight += options.border.width * 2
  }

  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const ctx = canvas.getContext('2d')!

  // Fill background
  if (options.backgroundColor !== 'transparent') {
    ctx.fillStyle = options.backgroundColor
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  }

  // Draw images
  loadedImages.forEach((img, index) => {
    const pos = imagePositions[index]
    if (pos) {
      ctx.drawImage(img, pos.x, pos.y, pos.width, pos.height)
      drawBorder(ctx, pos.x, pos.y, pos.width, pos.height, options.border)
    }
  })

  // Draw outer border if enabled
  if (options.border.enabled) {
    drawBorder(ctx, 0, 0, canvasWidth, canvasHeight, options.border)
  }

  return canvas
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpg' | 'webp',
  quality: number = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to create blob'))
        }
      },
      mimeType,
      quality
    )
  })
}

export function downloadImage(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

