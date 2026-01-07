# Merge Images Online

A powerful, modern web tool for merging multiple images online. Built with Next.js, TypeScript, and client-side image processing.

## Features

### Basic Features
- ✅ Drag & Drop + Multiple Image Upload
- ✅ Images reorder / remove / preview
- ✅ Merge Direction: Horizontal / Vertical
- ✅ Auto Resize toggle
- ✅ Padding control
- ✅ Border (type, color, width)
- ✅ Live merged image preview
- ✅ High quality image download
- ✅ Fully client-side processing (no server upload)

### Advanced Features
- ✅ Grid / Collage layouts (2x2, 3x3, custom)
- ✅ Aspect ratio presets (Instagram, YouTube, Facebook, Twitter, etc.)
- ✅ Background color selector (with transparent option)
- ✅ Export format selection (PNG / JPG / WebP)
- ✅ Image quality slider
- ✅ Before–After comparison mode
- ✅ Mobile-friendly gestures (drag, zoom, pinch)
- ✅ Undo / redo support
- ✅ Dark / Light mode

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Drag & Drop**: React DnD
- **Image Processing**: HTML5 Canvas API
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── Breadcrumbs.tsx     # Navigation breadcrumbs
│   ├── ImageUpload.tsx     # Drag & drop upload
│   ├── ImageList.tsx       # Image management
│   ├── MergeControls.tsx   # Merge settings
│   ├── MergeTool.tsx       # Main tool component
│   ├── PreviewPanel.tsx    # Live preview
│   ├── ThemeProvider.tsx   # Theme context
│   └── ThemeToggle.tsx     # Theme switcher
├── lib/
│   ├── imageProcessor.ts   # Image processing utilities
│   ├── store.ts            # Zustand store
│   └── bulkMerge.ts        # Bulk merge utilities
└── public/                 # Static assets
```

## Features in Detail

### Image Upload
- Drag and drop multiple images
- Click to browse files
- Supports PNG, JPG, GIF, WebP, BMP

### Image Management
- Drag to reorder images
- Click X to remove
- Preview thumbnails

### Merge Options
- **Direction**: Horizontal, Vertical, or Grid
- **Grid Layout**: Custom columns and rows
- **Aspect Ratio**: Presets for social media platforms
- **Auto Resize**: Automatically resize images to fit
- **Padding**: Adjust spacing between images
- **Background**: Choose color or transparent
- **Border**: Customize border style, color, and width

### Preview
- Real-time preview updates
- Zoom in/out (mouse wheel or buttons)
- Pan when zoomed (drag)
- Before/After comparison mode
- Mobile touch gestures (pinch to zoom, drag to pan)

### Export
- Multiple formats: PNG, JPG, WebP
- Quality control for JPG/WebP
- High-quality output

### History
- Undo/Redo support
- Up to 50 history states

## SEO & Performance

- Server-side rendering (SSR) for SEO
- Optimized metadata
- Fast client-side processing
- No server uploads required
- AdSense safe structure

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - feel free to use this project for your own purposes.

## Future Enhancements

- Bulk merge with ZIP download
- More layout options
- Image filters and effects
- Batch processing
- Pro version features

