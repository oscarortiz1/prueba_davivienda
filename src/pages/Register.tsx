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
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex flex-col items-start px-6">
          <Logo />
          <h1 className="mt-6 text-3xl font-bold text-indigo-700">Crea tu cuenta</h1>
          <p className="mt-3 text-gray-600">Regístrate para empezar a usar la prueba Davivienda.</p>
        </div>

        <Card className="mx-4">
          <AuthForm
            title="Crear cuenta"
            cta="Crear cuenta"
            fields={[{ name: 'name', label: 'Nombre' }, { name: 'email', label: 'Email', type: 'email' }, { name: 'password', label: 'Contraseña', type: 'password' }]}
            onSubmit={async (values) => {
              await register({ name: values.name, email: values.email, password: values.password })
              navigate('/')
            }}
          />
        </Card>
      </div>
    </div>
  )
}
