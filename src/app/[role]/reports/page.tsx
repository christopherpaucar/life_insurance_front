'use client'

import React from 'react'
import { ReportCard } from '@/components/reports/ReportCard'

interface ReportsPageProps {
  params: {
    role: string
  }
}

export default function ReportsPage({ params }: ReportsPageProps) {
  const unwrappedParams = params instanceof Promise ? React.use(params) : params
  const role = unwrappedParams.role

  const reports = [
    {
      title: 'Seguros Impagos',
      description: 'Ver clientes con pagos pendientes',
      href: `/${role}/reports/unpaid`,
    },
    {
      title: 'Contratos por Cliente',
      description: 'Ver estadísticas de contratos por cliente',
      href: `/${role}/reports/contracts-by-client`,
    },
    {
      title: 'Solicitudes Pendientes',
      description: 'Ver solicitudes pendientes de aprobación',
      href: `/${role}/reports/pending-requests`,
    },
    {
      title: 'Contratos por Vencer',
      description: 'Ver contratos próximos a vencer',
      href: `/${role}/reports/expiring-contracts`,
    },
  ]

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Reportes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {reports.map((report) => (
          <ReportCard
            key={report.href}
            title={report.title}
            description={report.description}
            href={report.href}
          />
        ))}
      </div>
    </>
  )
}
