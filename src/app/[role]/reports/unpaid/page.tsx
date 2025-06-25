'use client'

import React from 'react'

// @ts-ignore
export default function UnpaidReportsPage({ params }) {
  const role = params?.role || 'default'
  // TODO: Add logic to fetch and display unpaid reports
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reporte de Seguros Impagos</h1>
      <p>
        Mostrando reportes para el rol: <strong>{role}</strong>
      </p>
      {/* Placeholder for reports data */}
    </div>
  )
}
