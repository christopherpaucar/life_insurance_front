'use client'

import React from 'react'
import { AuthenticatedLayout } from '../../components/layouts/AuthenticatedLayout'

interface PageProps {
  params: Promise<{
    id: string
    role: string
  }>
  children: React.ReactNode
}

export default function AuthLayout({ children, params }: PageProps) {
  const unwrappedParams = React.use(params)
  const role = unwrappedParams.role

  const getLabelByRole = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Panel de Administración'
      case 'agent':
        return 'Panel de Agente'
      case 'reviewer':
        return 'Panel de Revisor'
      case 'client':
        return 'Panel de Cliente'
      default:
        return 'Panel de Administración'
    }
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-2">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-800">{getLabelByRole(role)}</h1>
        </div>
        {children}
      </div>
    </AuthenticatedLayout>
  )
}
