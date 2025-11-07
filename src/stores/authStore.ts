import { create } from 'zustand'
import { User } from '../domain/User'
import { makeAuthUseCases } from '../usecases/authUseCases'
import { MockAuthService } from '../infrastructure/MockAuthService'

const authService = new MockAuthService()
const authUseCases = makeAuthUseCases(authService)

interface AuthState {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  initAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),
  
  setLoading: (loading) => set({ loading }),

  login: async (email, password) => {
    const user = await authUseCases.login(email, password)
    set({ user })
  },

  register: async (data) => {
    const user = await authUseCases.register(data)
    set({ user })
  },

  logout: async () => {
    await authUseCases.logout()
    set({ user: null })
  },

  initAuth: async () => {
    set({ loading: true })
    try {
      const user = await authUseCases.current()
      set({ user })
    } finally {
      set({ loading: false })
    }
  },
}))
