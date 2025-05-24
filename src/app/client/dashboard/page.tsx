'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function ClientDashboardPage() {
  return (
    <DashboardLayout
      title="Panel del Cliente"
      description="Administre sus seguros, pagos y reembolsos"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          actionLabel="Ver Seguros"
          onAction={() => console.log('Navigate to insurances')}
        />

        <DashboardCard
          actionLabel="Ver Pagos"
          onAction={() => console.log('Navigate to payments')}
        />

        <DashboardCard
          actionLabel="Solicitar Reembolso"
          onAction={() => console.log('Navigate to reimbursements')}
        />
      </div>
    </DashboardLayout>
  )
}
