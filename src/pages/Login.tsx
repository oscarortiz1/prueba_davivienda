import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Card from '../ui/components/Card'
import AuthForm from '../ui/components/AuthForm'
import Logo from '../ui/components/Logo'
import { useAuthStore } from '../stores/authStore'

export default function LoginPage() {
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setShowSuccessMessage(true)
      setSearchParams({})
      setTimeout(() => setShowSuccessMessage(false), 5000)
    }
  }, [searchParams, setSearchParams])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-red-100 via-white to-orange-100 flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.20),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(249,115,22,0.15),_transparent_55%)]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#dc2626 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="hidden lg:flex flex-col gap-6 rounded-3xl border border-white/40 bg-white/60 p-10 shadow-lg shadow-red-100/40 backdrop-blur-xl">
          <Logo />
          <div>
            <h1 className="text-4xl font-bold text-red-600">Bienvenido</h1>
            <p className="mt-3 text-base text-gray-600">Accede a nuestra plataforma de encuestas diseñada para facilitar la recopilación de información valiosa.</p>
          </div>
          <ul className="space-y-4 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-gray-800">Crea encuestas personalizadas</p>
                <p className="text-xs">Diseña formularios adaptados a las necesidades de tu organización.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-gray-800">Análisis y reportes en tiempo real</p>
                <p className="text-xs">Obtén métricas y visualiza resultados instantáneamente.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-gray-800">Colaboración eficiente</p>
                <p className="text-xs">Mejora la comunicación y la toma de decisiones en tu equipo.</p>
              </div>
            </li>
          </ul>
        </div>

        <Card className="mx-auto w-full max-w-md">
          {showSuccessMessage && (
            <div className="mb-4 rounded-lg bg-green-50 p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-green-800">¡Registro exitoso!</p>
                  <p className="text-xs text-green-700">Ahora puedes iniciar sesión con tus credenciales.</p>
                </div>
              </div>
            </div>
          )}
          <AuthForm
            title="Iniciar sesión"
            cta="Entrar"
            subtitle="Ingresa tus credenciales para acceder a tu panel de encuestas."
            fields={[{ name: 'email', label: 'Email', type: 'email' }, { name: 'password', label: 'Contraseña', type: 'password' }]}
            onSubmit={async (values) => {
              await login(values.email, values.password)
              navigate('/')
            }}
          />
          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Aún no tienes cuenta?{' '}
            <a href="/register" className="font-medium text-red-600 hover:text-red-700 transition">Regístrate aquí</a>
          </p>
        </Card>
      </div>
    </div>
  )
}
