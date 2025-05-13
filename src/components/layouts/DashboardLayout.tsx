'use client'

import React from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function DashboardLayout({
  children,
  title = 'Dashboard',
  description = 'Bienvenido a su panel de control',
}: DashboardLayoutProps) {
  return (
    <div className="flex flex-col px-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  )
}
