import React, { createContext, useContext, useEffect, useState } from 'react'
import { MockAuthService } from '../infrastructure/MockAuthService'
import { makeAuthUseCases } from '../usecases/authUseCases'
import type { User } from '../domain/User'

const repo = new MockAuthService()
const usecases = makeAuthUseCases(repo)

type AuthContextValue = {
  user: User | null
  loading: boolean
  register: (data: { name: string; email: string; password: string }) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    usecases.current().then(u => {
      if (mounted) setUser(u)
    }).finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  async function register(data: { name: string; email: string; password: string }) {
    const u = await usecases.register(data)
    setUser(u)
  }

  async function login(email: string, password: string) {
    const u = await usecases.login(email, password)
    setUser(u)
  }

  async function logout() {
    await usecases.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
