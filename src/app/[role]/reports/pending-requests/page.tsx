'use client'

import React from 'react'

// @ts-ignore
export default function PendingRequestsPage({ params }) {
  const role = params?.role || 'default'
  // TODO: Add logic to fetch and display pending requests
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reporte de Solicitudes Pendientes</h1>
      <p>
        Mostrando reportes para el rol: <strong>{role}</strong>
      </p>
      {/* Placeholder for reports data */}
    </div>
  )
}
