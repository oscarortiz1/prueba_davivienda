import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export default function Button({ variant = 'primary', children, className = '', ...rest }: Props) {
  const base = 'px-4 py-2 rounded-md font-medium transition'
  const styles = variant === 'primary'
    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
    : 'bg-transparent text-indigo-600 border border-indigo-200 hover:bg-indigo-50'

  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  )
}
