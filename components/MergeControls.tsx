'use client'

import { useMergeStore } from '@/lib/store'
import { ASPECT_RATIO_PRESETS } from '@/lib/imageProcessor'
import { Grid, Layout, Maximize2, Palette, Square } from 'lucide-react'

export function MergeControls() {
  const { options, updateOptions } = useMergeStore()

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Merge Settings</h3>

      {/* Merge Direction */}
      <div>
        <label className="block text-sm font-medium mb-2">Merge Direction</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => updateOptions({ direction: 'horizontal' })}
            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
              options.direction === 'horizontal'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <Layout className="w-5 h-5" />
            <span className="text-xs">Horizontal</span>
          </button>
          <button
            onClick={() => updateOptions({ direction: 'vertical' })}
            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
              options.direction === 'vertical'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <Layout className="w-5 h-5 rotate-90" />
            <span className="text-xs">Vertical</span>
          </button>
          <button
            onClick={() => updateOptions({ direction: 'grid' })}
            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
              options.direction === 'grid'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <Grid className="w-5 h-5" />
            <span className="text-xs">Grid</span>
          </button>
        </div>
      </div>

      {/* Grid Settings */}
      {options.direction === 'grid' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Columns</label>
            <input
              type="number"
              min="1"
              max="10"
              value={options.gridColumns || 2}
              onChange={(e) => updateOptions({ gridColumns: parseInt(e.target.value) || 2 })}
              className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Rows</label>
            <input
              type="number"
              min="1"
              max="10"
              value={options.gridRows || 2}
              onChange={(e) => updateOptions({ gridRows: parseInt(e.target.value) || 2 })}
              className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      )}

      {/* Aspect Ratio Preset */}
      <div>
        <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
        <select
          value={options.aspectRatio 
            ? ASPECT_RATIO_PRESETS.findIndex(
                p => p.width === options.aspectRatio?.width && p.height === options.aspectRatio?.height
              ) 
            : 0
          }
          onChange={(e) => {
            const preset = ASPECT_RATIO_PRESETS[parseInt(e.target.value)]
            updateOptions({
              aspectRatio: preset.width > 0 && preset.height > 0
                ? { width: preset.width, height: preset.height }
                : undefined
            })
          }}
          className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {ASPECT_RATIO_PRESETS.map((preset, index) => (
            <option key={index} value={index}>
              {preset.name} {preset.width > 0 ? `(${preset.width}×${preset.height})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Auto Resize */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Maximize2 className="w-4 h-4 text-muted-foreground" />
          <label className="text-sm font-medium">Auto Resize</label>
        </div>
        <button
          onClick={() => updateOptions({ autoResize: !options.autoResize })}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            options.autoResize ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              options.autoResize ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Padding */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Padding: {options.padding}px
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={options.padding}
          onChange={(e) => updateOptions({ padding: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Background Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={options.backgroundColor === 'transparent' ? '#ffffff' : options.backgroundColor}
            onChange={(e) => updateOptions({ backgroundColor: e.target.value })}
            className="w-12 h-10 rounded-lg border border-input cursor-pointer"
          />
          <input
            type="text"
            value={options.backgroundColor}
            onChange={(e) => updateOptions({ backgroundColor: e.target.value })}
            placeholder="#ffffff or transparent"
            className="flex-1 px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={() => updateOptions({ backgroundColor: 'transparent' })}
            className={`px-3 py-2 border-2 rounded-lg transition-colors ${
              options.backgroundColor === 'transparent'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
            title="Transparent"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Border Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium flex items-center gap-2">
            <Square className="w-4 h-4" />
            Border
          </label>
          <button
            onClick={() => updateOptions({
              border: { ...options.border, enabled: !options.border.enabled }
            })}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              options.border.enabled ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                options.border.enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {options.border.enabled && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Border Type</label>
              <select
                value={options.border.type}
                onChange={(e) => updateOptions({
                  border: { ...options.border, type: e.target.value as 'solid' | 'dashed' | 'dotted' }
                })}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Border Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={options.border.color}
                  onChange={(e) => updateOptions({
                    border: { ...options.border, color: e.target.value }
                  })}
                  className="w-12 h-10 rounded-lg border border-input cursor-pointer"
                />
                <input
                  type="text"
                  value={options.border.color}
                  onChange={(e) => updateOptions({
                    border: { ...options.border, color: e.target.value }
                  })}
                  className="flex-1 px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Border Width: {options.border.width}px
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={options.border.width}
                onChange={(e) => updateOptions({
                  border: { ...options.border, width: parseInt(e.target.value) }
                })}
                className="w-full"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

