'use client'

import React from 'react'
import { ReportCard } from '@/components/reports/ReportCard'

// @ts-ignore
export default function ContractsByClientPage({ params }) {
  const role = params?.role || 'default'
  // TODO: Add logic to fetch and display contracts by client
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Reporte de Contratos por Cliente</h1>
      <p>
        Mostrando reportes para el rol: <strong>{role}</strong>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard
          title="Contratos Activos"
          description="Ver contratos activos por cliente"
          href={`/${role}/reports/contracts-by-client/active`}
        />
        <ReportCard
          title="Contratos Inactivos"
          description="Ver contratos inactivos por cliente"
          href={`/${role}/reports/contracts-by-client/inactive`}
        />
        <ReportCard
          title="Historial de Contratos"
          description="Ver historial de contratos por cliente"
          href={`/${role}/reports/contracts-by-client/history`}
        />
      </div>
    </div>
  )
}
