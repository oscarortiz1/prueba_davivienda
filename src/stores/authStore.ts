import { create } from 'zustand'
import { User } from '../domain/User'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

axios.defaults.baseURL = API_URL


axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

interface AuthState {
  user: User | null
  loading: boolean
  token: string | null
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setToken: (token: string | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  initAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  token: localStorage.getItem('token'),

  setUser: (user) => set({ user }),
  
  setLoading: (loading) => set({ loading }),
  
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
    set({ token })
  },

  login: async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password })
      const { token, userId, name, email: userEmail } = response.data
      
      const user: User = { id: userId, name, email: userEmail }
      
      set({ user, token })
      localStorage.setItem('token', token)
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors
        const errorMessages = Object.entries(backendErrors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(', ')
        throw new Error(errorMessages)
      }
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  register: async (data) => {
    try {
      await axios.post('/auth/register', data)
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors
        const errorMessages = Object.entries(backendErrors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(', ')
        throw new Error(errorMessages)
      }
      throw new Error(error.response?.data?.message || 'Error en el registro')
    }
  },

  logout: async () => {
    set({ user: null, token: null })
    localStorage.removeItem('token')
  },

  initAuth: async () => {
    set({ loading: true })
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        set({ loading: false })
        return
      }
      
      const response = await axios.get('/auth/me')
      set({ user: response.data })
    } catch (error) {
      localStorage.removeItem('token')
      set({ user: null, token: null })
    } finally {
      set({ loading: false })
    }
  },
}))
