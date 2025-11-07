import { create } from 'zustand'

interface UIState {
  deleteConfirmId: string | null
  showLoginSuccessMessage: boolean
  setDeleteConfirmId: (id: string | null) => void
  setShowLoginSuccessMessage: (show: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  deleteConfirmId: null,
  showLoginSuccessMessage: false,
  setDeleteConfirmId: (id) => set({ deleteConfirmId: id }),
  setShowLoginSuccessMessage: (show) => set({ showLoginSuccessMessage: show }),
}))
