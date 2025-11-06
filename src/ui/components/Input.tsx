import React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string | null
  id?: string
}

export default function Input({ label, className = '', error = null, id, ...rest }: Props) {
  const inputId = id || (label ? label.replace(/\s+/g, '_').toLowerCase() : undefined)
  return (
    <div className="block text-sm">
      {label && <label htmlFor={inputId} className="mb-1 block text-gray-600 font-medium">{label}</label>}
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`w-full px-3 py-2 border rounded-md bg-white text-gray-800 focus:outline-none focus:shadow-[0_0_0_4px_rgba(99,102,241,0.12)] ${className}`}
        {...rest}
      />
      {error && <p id={`${inputId}-error`} role="alert" className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
