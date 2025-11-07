import React from 'react'

type Props = {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: Props) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/40 bg-white/90 shadow-xl shadow-red-100/60 backdrop-blur-xl p-8 sm:p-10 ${className}`}>
      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-red-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/70 via-white/30 to-white/0" />

      <div className="relative">
        {children}
      </div>
    </div>
  )
}
