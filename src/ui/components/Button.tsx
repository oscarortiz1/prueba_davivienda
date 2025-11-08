import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export default function Button({ variant = 'primary', children, className = '', disabled, ...rest }: Props) {
  const base = 'inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md font-medium transition'
  const styles = variant === 'primary'
    ? 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-200/50 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none'
    : 'bg-transparent text-red-600 border border-red-200 hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed'

  return (
    <button className={`${base} ${styles} ${className}`} disabled={disabled} {...rest}>
      {children}
    </button>
  )
}
