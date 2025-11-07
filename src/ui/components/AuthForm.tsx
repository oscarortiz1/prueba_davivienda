import { useEffect, useRef } from 'react'
import { useFormStore } from '../../stores/formStore'
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
  subtitle?: string
}

export default function AuthForm({ title, cta, fields, onSubmit, subtitle }: Props) {
  const values = useFormStore((state) => state.values)
  const errors = useFormStore((state) => state.errors)
  const loading = useFormStore((state) => state.loading)
  const globalError = useFormStore((state) => state.globalError)
  const setValue = useFormStore((state) => state.setValue)
  const setErrors = useFormStore((state) => state.setErrors)
  const setLoading = useFormStore((state) => state.setLoading)
  const setGlobalError = useFormStore((state) => state.setGlobalError)
  const reset = useFormStore((state) => state.reset)
  
  const isSubmitting = useRef(false)

  useEffect(() => {
    reset(fields.map(f => f.name))
  }, [reset])

  function handleChange(name: string, v: string) {
    setValue(name, v)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    
    if (loading || isSubmitting.current) {
      return
    }
    
    isSubmitting.current = true
    
    setGlobalError(null)
    setErrors({})
    
    const newErrors: Record<string, string> = {}
    fields.forEach(f => {
      if (!values[f.name]) newErrors[f.name] = 'Campo requerido'
      if (f.type === 'email' && values[f.name] && !values[f.name].includes('@')) {
        newErrors[f.name] = 'El correo debe contener el símbolo @'
      }
    })
    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      isSubmitting.current = false
      return
    }

    setLoading(true)
    try {
      await onSubmit(values)
    } catch (err: any) {
      const errorMessage = err?.message || 'Error inesperado'

      if (errorMessage.includes(':')) {
        const fieldErrors: Record<string, string> = {}
        const errorParts = errorMessage.split(', ')
        
        errorParts.forEach((part: string) => {
          const [field, msg] = part.split(': ')
          if (field && msg) {
            fieldErrors[field.toLowerCase()] = msg
          }
        })
        
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors)
        } else {
          setGlobalError(errorMessage)
        }
      } else if (errorMessage.toLowerCase().includes('correo') || errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('@')) {
        setErrors({ email: errorMessage })
      } else {
        setGlobalError(errorMessage)
      }
    } finally {
      setLoading(false)
      isSubmitting.current = false
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Acceso seguro
        </span>
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 leading-relaxed">{subtitle}</p>}
      </div>
      {fields.map(f => (
        <Input key={f.name} label={f.label} type={f.type} value={values[f.name]} onChange={e => handleChange(f.name, e.target.value)} error={errors[f.name] ?? null} />
      ))}

      {globalError && <div className="text-red-600 text-sm">{globalError}</div>}

      <div className="pt-2">
        <Button type="submit" disabled={loading} className="w-full justify-center">
          {loading ? 'Enviando...' : cta}
        </Button>
      </div>
    </form>
  )
}
