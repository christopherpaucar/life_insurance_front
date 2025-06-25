'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function ClientDashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Panel del Cliente</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          actionLabel="Ver Mis Seguros"
          onAction={() => console.log('Navigate to insurances')}
        >
          <h3 className="text-xl font-semibold">Mis Seguros</h3>
          <p className="text-muted-foreground mt-2">
            Vea y gestione sus pólizas de seguro activas.
          </p>
        </DashboardCard>
        <DashboardCard
          actionLabel="Ver Mis Pagos"
          onAction={() => console.log('Navigate to payments')}
        >
          <h3 className="text-xl font-semibold">Mis Pagos</h3>
          <p className="text-muted-foreground mt-2">
            Consulte su historial de pagos y facturas.
          </p>
        </DashboardCard>
        <DashboardCard
          actionLabel="Solicitar Reembolso"
          onAction={() => console.log('Navigate to reimbursements')}
        >
          <h3 className="text-xl font-semibold">Reembolsos</h3>
          <p className="text-muted-foreground mt-2">
            Inicie y siga el estado de sus solicitudes de reembolso.
          </p>
        </DashboardCard>
      </div>
    </div>
  )
}
