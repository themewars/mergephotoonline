# Quick Start Guide

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   Navigate to `http://localhost:3000`

## Build for Production

```bash
npm run build
npm start
```

## Key Features Implemented

✅ **Basic Features:**
- Drag & Drop image upload
- Multiple image support
- Reorder images by dragging
- Remove images
- Preview thumbnails
- Horizontal/Vertical merge
- Auto resize toggle
- Padding control
- Border customization
- Live preview
- High-quality download
- 100% client-side processing

✅ **Advanced Features:**
- Grid/Collage layouts (custom columns/rows)
- Aspect ratio presets (Instagram, YouTube, Facebook, Twitter, etc.)
- Background color picker (with transparent option)
- Export formats (PNG, JPG, WebP)
- Quality slider for JPG/WebP
- Before/After comparison mode
- Mobile gestures (pinch to zoom, drag to pan)
- Undo/Redo support
- Dark/Light mode

## Usage Tips

1. **Upload Images:** Drag & drop or click to select multiple images
2. **Reorder:** Drag images in the thumbnail list to change order
3. **Merge Settings:** Adjust direction, padding, borders, and background
4. **Preview:** See live preview with zoom and pan controls
5. **Export:** Choose format and quality, then download

## Mobile Support

- Touch gestures for zoom (pinch)
- Drag to pan when zoomed
- Responsive layout
- Touch-friendly controls

## Browser Compatibility

Works best on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Notes

- All processing happens in the browser (no server uploads)
- Images are processed using HTML5 Canvas API
- State is managed with Zustand
- History supports up to 50 undo/redo states

