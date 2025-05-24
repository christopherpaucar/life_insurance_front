'use client'

import React from 'react'
import { ReportCard } from '@/components/reports/ReportCard'

interface ContractsByClientPageProps {
  params: {
    role: string
  }
}

export default function ContractsByClientPage({ params }: ContractsByClientPageProps) {
  const role = params.role

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Contratos por Cliente</h2>
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
