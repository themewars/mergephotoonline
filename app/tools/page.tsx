'use client'

import Link from 'next/link'
import { 
  Image, 
  Maximize2, 
  FileDown, 
  RefreshCw, 
  Crop, 
  Scissors,
  Eraser,
  Type,
  Palette,
  Split
} from 'lucide-react'

const tools = [
  {
    id: 'merge-photos',
    title: 'Merge Photos Online',
    description: 'Combine multiple photos into one. Merge photos horizontally, vertically, or in grid layouts.',
    icon: Image,
    href: '/',
    color: 'bg-blue-500',
    searchVolume: 'High',
  },
  {
    id: 'resize-image',
    title: 'Resize Image Online',
    description: 'Resize images by dimensions or percentage. Maintain aspect ratio with presets for social media.',
    icon: Maximize2,
    href: '/tools/resize-image',
    color: 'bg-green-500',
    searchVolume: 'Very High',
  },
  {
    id: 'compress-image',
    title: 'Compress Image Online',
    description: 'Reduce image file size without losing quality. Compress JPG, PNG, WebP images for faster loading.',
    icon: FileDown,
    href: '/tools/compress-image',
    color: 'bg-purple-500',
    searchVolume: 'Very High',
  },
  {
    id: 'convert-image',
    title: 'Convert Image Format',
    description: 'Convert images between PNG, JPG, WebP, GIF formats. Batch conversion with quality control.',
    icon: RefreshCw,
    href: '/tools/convert-image',
    color: 'bg-orange-500',
    searchVolume: 'High',
  },
  {
    id: 'crop-image',
    title: 'Crop Image Online',
    description: 'Crop images with free selection or fixed aspect ratios. Perfect for social media posts.',
    icon: Crop,
    href: '/tools/crop-image',
    color: 'bg-pink-500',
    searchVolume: 'High',
  },
  {
    id: 'split-image',
    title: 'Split Image Online',
    description: 'Split images into multiple parts. Create grid splits for Instagram posts or collages.',
    icon: Scissors,
    href: '/tools/split-image',
    color: 'bg-indigo-500',
    searchVolume: 'Medium',
  },
  {
    id: 'remove-background',
    title: 'Remove Background',
    description: 'Remove image background automatically. Create transparent PNG images instantly.',
    icon: Eraser,
    href: '/tools/remove-background',
    color: 'bg-red-500',
    searchVolume: 'Very High',
  },
  {
    id: 'add-watermark',
    title: 'Add Watermark to Image',
    description: 'Add text or image watermarks to protect your photos. Customize position, opacity, and size.',
    icon: Type,
    href: '/tools/add-watermark',
    color: 'bg-teal-500',
    searchVolume: 'High',
  },
  {
    id: 'rotate-image',
    title: 'Rotate & Flip Image',
    description: 'Rotate images 90°, 180°, 270° or flip horizontally/vertically. Batch processing supported.',
    icon: RefreshCw,
    href: '/tools/rotate-image',
    color: 'bg-cyan-500',
    searchVolume: 'Medium',
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Free Online Image Tools</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Professional image editing tools - all free, all online, no registration required. 
            Process images directly in your browser with 100% privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className={`${tool.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                      {tool.searchVolume === 'Very High' && (
                        <span className="text-xs bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>Use Tool</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-16 bg-muted/30 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Why Choose Our Image Tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div>
              <h3 className="font-semibold mb-2">100% Free</h3>
              <p className="text-sm text-muted-foreground">
                All tools are completely free. No hidden costs, no subscriptions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">
                All processing happens in your browser. Images never leave your device.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">No Registration</h3>
              <p className="text-sm text-muted-foreground">
                Start using tools instantly. No sign-up required, no email needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

