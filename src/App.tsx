import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import LoginPage from './pages/Login.tsx'
import RegisterPage from './pages/Register.tsx'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <header className="max-w-4xl mx-auto p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700">Prueba Davivienda</h1>
        <nav className="space-x-4">
          <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
          <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<div className="text-center py-20">Bienvenido — use Login o Register</div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  )
}
