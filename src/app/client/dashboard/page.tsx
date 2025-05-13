'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function ClientDashboardPage() {
  return (
    <DashboardLayout title="Panel del Cliente" description="Administre sus seguros, pagos y reembolsos">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Mis Seguros"
          description="Vea y administre sus seguros contratados"
          actionLabel="Ver Seguros"
          onAction={() => console.log('Navigate to insurances')}
        />

        <DashboardCard
          title="Pagos Pendientes"
          description="Visualice y pague sus facturas pendientes"
          actionLabel="Ver Pagos"
          onAction={() => console.log('Navigate to payments')}
        />

        <DashboardCard
          title="Reembolsos"
          description="Solicite reembolsos y consulte su estado"
          actionLabel="Solicitar Reembolso"
          onAction={() => console.log('Navigate to reimbursements')}
        />
      </div>
    </DashboardLayout>
  )
}
