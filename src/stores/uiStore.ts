import { create } from 'zustand'

interface UIState {
  deleteConfirmId: string | null
  setDeleteConfirmId: (id: string | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  deleteConfirmId: null,
  setDeleteConfirmId: (id) => set({ deleteConfirmId: id }),
}))
