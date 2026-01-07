import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { ImageData, MergeOptions, mergeImages, canvasToBlob } from './imageProcessor'

export async function bulkMerge(
  imageGroups: ImageData[][],
  options: MergeOptions,
  format: 'png' | 'jpg' | 'webp' = 'png',
  quality: number = 0.92
): Promise<void> {
  const zip = new JSZip()
  
  for (let i = 0; i < imageGroups.length; i++) {
    const group = imageGroups[i]
    if (group.length === 0) continue

    try {
      const canvas = await mergeImages(group, options)
      const blob = await canvasToBlob(canvas, format, quality)
      const extension = format === 'jpg' ? 'jpg' : format
      zip.file(`merged-${i + 1}.${extension}`, blob)
    } catch (error) {
      console.error(`Error merging group ${i + 1}:`, error)
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' })
  saveAs(zipBlob, `merged-images-${Date.now()}.zip`)
}

