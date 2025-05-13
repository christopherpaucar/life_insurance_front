'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function ReviewerDashboardPage() {
  return (
    <DashboardLayout title="Panel del Revisor" description="Revise solicitudes, documentos y genere reportes">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Solicitudes Pendientes"
          description="Revise solicitudes pendientes de aprobación"
          actionLabel="Ver Pendientes"
          onAction={() => console.log('Navigate to pending')}
        />

        <DashboardCard
          title="Documentación"
          description="Verifique documentos de solicitudes"
          actionLabel="Ver Documentos"
          onAction={() => console.log('Navigate to documents')}
        />

        <DashboardCard
          title="Reportes"
          description="Genere informes de actividades"
          actionLabel="Ver Reportes"
          onAction={() => console.log('Navigate to reports')}
        />
      </div>
    </DashboardLayout>
  )
}
