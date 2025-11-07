import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import LoginPage from './pages/Login.tsx'
import RegisterPage from './pages/Register.tsx'
import HomePage from './pages/Home.tsx'
import SurveyEditor from './pages/SurveyEditor.tsx'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-r-transparent"></div>
      </div>
    )
  }
  
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/survey/:id/edit" element={<ProtectedRoute><SurveyEditor /></ProtectedRoute>} />
        <Route path="/survey/new" element={<ProtectedRoute><SurveyEditor /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}
