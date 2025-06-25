'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function AgentDashboardPage() {
  return (
    <DashboardLayout
      title="Panel del Agente"
      description="Gestione clientes, contratos y reembolsos"
    >
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Agent Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            actionLabel="Ver Clientes"
            onAction={() => console.log('Navigate to clients')}
          >
            <h3 className="text-xl font-semibold">Clientes</h3>
            <p className="text-muted-foreground mt-2">
              Gestione la información de sus clientes
            </p>
          </DashboardCard>
          <DashboardCard
            actionLabel="Ver Contratos"
            onAction={() => console.log('Navigate to contracts')}
          >
            <h3 className="text-xl font-semibold">Contratos</h3>
            <p className="text-muted-foreground mt-2">
              Administre los contratos de seguros de sus clientes
            </p>
          </DashboardCard>
          <DashboardCard
            actionLabel="Ver Reportes"
            onAction={() => console.log('Navigate to reports')}
          >
            <h3 className="text-xl font-semibold">Reportes</h3>
            <p className="text-muted-foreground mt-2">
              Genere reportes de ventas y rendimiento
            </p>
          </DashboardCard>
        </div>
      </div>
    </DashboardLayout>
  )
}
