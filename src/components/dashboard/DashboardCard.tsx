import React from 'react'

interface DashboardCardProps {
  children?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
}

export function DashboardCard({ children, actionLabel, onAction }: DashboardCardProps) {
  return (
    <div>
      {children}
      {actionLabel && (
        <button onClick={onAction} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {actionLabel}
        </button>
      )}
    </div>
  )
}
