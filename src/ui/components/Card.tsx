import React from 'react'

export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 sm:p-10 ${className}`}>
      {children}
    </div>
  )
}
