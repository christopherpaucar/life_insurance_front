import React from 'react'

interface DashboardCardProps {
  title: string
  description: string
  children?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
}

export function DashboardCard({ title, description, children, actionLabel, onAction }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      {children}
      {actionLabel && (
        <button onClick={onAction} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {actionLabel}
        </button>
      )}
    </div>
  )
}
