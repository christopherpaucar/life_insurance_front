'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function ReviewerDashboardPage() {
  return (
    <DashboardLayout
      title="Panel del Revisor"
      description="Revise solicitudes, documentos y genere reportes"
    >
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Reviewer Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            actionLabel="Ver Pendientes"
            onAction={() => console.log('Navigate to pending')}
          >
            <h3 className="text-xl font-semibold">Solicitudes Pendientes</h3>
            <p className="text-muted-foreground mt-2">
              Revise solicitudes pendientes de aprobación
            </p>
          </DashboardCard>
          <DashboardCard
            actionLabel="Ver Aprobadas"
            onAction={() => console.log('Navigate to approved')}
          >
            <h3 className="text-xl font-semibold">Solicitudes Aprobadas</h3>
            <p className="text-muted-foreground mt-2">
              Consulte el historial de solicitudes aprobadas
            </p>
          </DashboardCard>
          <DashboardCard
            actionLabel="Ver Rechazadas"
            onAction={() => console.log('Navigate to rejected')}
          >
            <h3 className="text-xl font-semibold">Solicitudes Rechazadas</h3>
            <p className="text-muted-foreground mt-2">
              Consulte el historial de solicitudes rechazadas
            </p>
          </DashboardCard>
        </div>
      </div>
    </DashboardLayout>
  )
}
