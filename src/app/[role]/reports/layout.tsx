'use client'

import React from 'react'
import { AuthenticatedLayout } from '../../../components/layouts/AuthenticatedLayout'

interface ReportsLayoutProps {
  children: React.ReactNode
  params: Promise<{ role: string }> | { role: string }
}

export default function ReportsLayout({ children, params }: ReportsLayoutProps) {
  const unwrappedParams = params instanceof Promise ? React.use(params) : params
  const role = unwrappedParams.role

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {role === 'admin' ? 'Panel de Administración' : 'Panel de Agente'}
          </h1>
        </div>
        {children}
      </div>
    </AuthenticatedLayout>
  )
}
