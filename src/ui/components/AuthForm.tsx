import React from 'react'
import Input from './Input'
import Button from './Button'

type Fields = Array<{
  name: string
  label: string
  type?: string
}>

type Props = {
  title: string
  cta: string
  fields: Fields
  onSubmit: (values: Record<string, string>) => Promise<void>
}

export default function AuthForm({ title, cta, fields, onSubmit }: Props) {
  const [values, setValues] = React.useState<Record<string, string>>(() => Object.fromEntries(fields.map(f => [f.name, ''])))
  const [errors, setErrors] = React.useState<Record<string, string | null>>({})
  const [loading, setLoading] = React.useState(false)
  const [globalError, setGlobalError] = React.useState<string | null>(null)

  function handleChange(name: string, v: string) {
    setValues(prev => ({ ...prev, [name]: v }))
    setErrors(prev => ({ ...prev, [name]: null }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError(null)
    const newErrors: Record<string, string> = {}
    fields.forEach(f => {
      if (!values[f.name]) newErrors[f.name] = 'Campo requerido'
      if (f.type === 'email' && values[f.name] && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values[f.name])) newErrors[f.name] = 'Email inválido'
    })
    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await onSubmit(values)
    } catch (err: any) {
      setGlobalError(err?.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      {fields.map(f => (
        <Input key={f.name} label={f.label} type={f.type} value={values[f.name]} onChange={e => handleChange(f.name, e.target.value)} error={errors[f.name] ?? null} />
      ))}

      {globalError && <div className="text-red-600 text-sm">{globalError}</div>}

      <div className="pt-2">
        <Button type="submit" disabled={loading}>{loading ? 'Enviando...' : cta}</Button>
      </div>
    </form>
  )
}
