import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export default function Button({ variant = 'primary', children, className = '', ...rest }: Props) {
  const base = 'px-4 py-2 rounded-md font-medium transition'
  const styles = variant === 'primary'
    ? 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-200/50'
    : 'bg-transparent text-red-600 border border-red-200 hover:bg-red-50'

  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  )
}
