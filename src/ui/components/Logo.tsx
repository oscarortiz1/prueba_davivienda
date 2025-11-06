import React from 'react'

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-bold">DV</div>
      <div className="text-lg font-semibold text-indigo-700">Davivienda</div>
    </div>
  )
}
