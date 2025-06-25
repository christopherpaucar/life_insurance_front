'use client'

import React from 'react'
import { ReportCard } from '@/components/reports/ReportCard'

// @ts-ignore
export default function ExpiringContractsPage({ params }) {
  const role = params?.role || 'default'

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Contratos por Vencer</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard
          title="Próximos 30 días"
          description="Ver contratos que vencen en 30 días"
          href={`/${role}/reports/expiring-contracts/30-days`}
        />
        <ReportCard
          title="Próximos 60 días"
          description="Ver contratos que vencen en 60 días"
          href={`/${role}/reports/expiring-contracts/60-days`}
        />
        <ReportCard
          title="Próximos 90 días"
          description="Ver contratos que vencen en 90 días"
          href={`/${role}/reports/expiring-contracts/90-days`}
        />
      </div>
    </div>
  )
}
