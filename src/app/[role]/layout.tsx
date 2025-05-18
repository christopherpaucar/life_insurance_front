'use client'

import React from 'react'
import { AuthenticatedLayout } from '../../components/layouts/AuthenticatedLayout'

interface AuthLayoutProps {
  children: React.ReactNode
  params: Promise<{ role: string }> | { role: string }
}

export default function AuthLayout({ children, params }: AuthLayoutProps) {
  const unwrappedParams = params instanceof Promise ? React.use(params) : params
  const role = unwrappedParams.role

  const getLabelByRole = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Panel de Administración'
      case 'agent':
        return 'Panel de Agente'
      case 'client':
        return ''
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
