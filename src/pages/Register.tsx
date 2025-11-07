import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../ui/components/Card'
import AuthForm from '../ui/components/AuthForm'
import Logo from '../ui/components/Logo'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-100 via-white to-red-100 flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.18),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(220,38,38,0.2),_transparent_55%)]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ea580c 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="hidden lg:flex flex-col gap-6 rounded-3xl border border-white/40 bg-white/60 p-10 shadow-lg shadow-orange-100/40 backdrop-blur-xl">
          <Logo />
          <div>
            <h1 className="text-4xl font-bold text-red-600">Únete a nuestra plataforma</h1>
            <p className="mt-3 text-base text-gray-600">Crea tu cuenta y comienza a diseñar encuestas que optimicen la toma de decisiones en tu organización.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-800">Encuestas personalizadas</p>
              </div>
              <p className="text-gray-600 text-xs">Crea formularios adaptados a tus necesidades específicas.</p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-800">Respuestas en tiempo real</p>
              </div>
              <p className="text-gray-600 text-xs">Recopila información valiosa de forma instantánea.</p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-800">Mejora la comunicación</p>
              </div>
              <p className="text-gray-600 text-xs">Facilita el feedback entre equipos y clientes.</p>
            </div>
          </div>
        </div>

        <Card className="mx-auto w-full max-w-md">
          <AuthForm
            title="Crear cuenta"
            cta="Registrarse"
            subtitle="Completa los datos para comenzar a usar nuestra plataforma de encuestas."
            fields={[{ name: 'name', label: 'Nombre completo' }, { name: 'email', label: 'Email', type: 'email' }, { name: 'password', label: 'Contraseña', type: 'password' }]}
            onSubmit={async (values) => {
              await register({ name: values.name, email: values.email, password: values.password })
              navigate('/')
            }}
          />
          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes una cuenta?{' '}
            <a href="/login" className="font-medium text-red-600 hover:text-red-700 transition">Inicia sesión</a>
          </p>
        </Card>
      </div>
    </div>
  )
}
