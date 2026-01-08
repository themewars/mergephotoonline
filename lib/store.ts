import { create } from 'zustand'
import { ImageData, MergeOptions } from './imageProcessor'

interface HistoryState {
  images: ImageData[]
  options: MergeOptions
}

interface MergeStore {
  images: ImageData[]
  options: MergeOptions
  history: HistoryState[]
  historyIndex: number
  previewCanvas: HTMLCanvasElement | null
  
  // Actions
  setImages: (images: ImageData[]) => void
  addImage: (image: ImageData) => void
  removeImage: (id: string) => void
  reorderImages: (fromIndex: number, toIndex: number) => void
  updateOptions: (options: Partial<MergeOptions>) => void
  setPreviewCanvas: (canvas: HTMLCanvasElement | null) => void
  
  // History
  saveToHistory: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

const defaultOptions: MergeOptions = {
  direction: 'horizontal',
  autoResize: true,
  padding: 0,
  border: {
    enabled: false,
    type: 'solid',
    color: '#000000',
    width: 2,
  },
  backgroundColor: '#ffffff',
}

export const useMergeStore = create<MergeStore>((set, get) => ({
  images: [],
  options: defaultOptions,
  history: [],
  historyIndex: -1,
  previewCanvas: null,

  setImages: (images) => {
    set({ images })
    get().saveToHistory()
  },

  addImage: (image) => {
    const images = [...get().images, image]
    set({ images })
    get().saveToHistory()
  },

  removeImage: (id) => {
    const images = get().images.filter(img => img.id !== id)
    set({ images })
    get().saveToHistory()
  },

  reorderImages: (fromIndex, toIndex) => {
    const images = [...get().images]
    const [removed] = images.splice(fromIndex, 1)
    images.splice(toIndex, 0, removed)
    set({ images })
    get().saveToHistory()
  },

  updateOptions: (newOptions) => {
    set({ options: { ...get().options, ...newOptions } })
  },

  setPreviewCanvas: (canvas) => {
    set({ previewCanvas: canvas })
  },

  saveToHistory: () => {
    const state = get()
    const historyState: HistoryState = {
      images: [...state.images],
      options: { ...state.options },
    }
    
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(historyState)
    
    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift()
    } else {
      set({ historyIndex: newHistory.length - 1 })
    }
    
    set({ history: newHistory })
  },

  undo: () => {
    const state = get()
    if (state.historyIndex > 0) {
      const prevState = state.history[state.historyIndex - 1]
      set({
        images: prevState.images,
        options: prevState.options,
        historyIndex: state.historyIndex - 1,
      })
    }
  },

  redo: () => {
    const state = get()
    if (state.historyIndex < state.history.length - 1) {
      const nextState = state.history[state.historyIndex + 1]
      set({
        images: nextState.images,
        options: nextState.options,
        historyIndex: state.historyIndex + 1,
      })
    }
  },

  canUndo: () => {
    return get().historyIndex > 0
  },

  canRedo: () => {
    const state = get()
    return state.historyIndex < state.history.length - 1
  },
}))

