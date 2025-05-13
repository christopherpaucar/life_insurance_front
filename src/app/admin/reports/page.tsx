'use client'

import React from 'react'
import Link from 'next/link'

export default function AdminReportsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Reportes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Link href="/admin/reports/unpaid">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h2 className="text-lg font-semibold mb-4">Seguros Impagos</h2>
            <p className="text-gray-600">Ver clientes con pagos pendientes</p>
          </div>
        </Link>

        <Link href="/admin/reports/contracts-by-client">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h2 className="text-lg font-semibold mb-4">Contratos por Cliente</h2>
            <p className="text-gray-600">Ver estadísticas de contratos por cliente</p>
          </div>
        </Link>

        <Link href="/admin/reports/pending-requests">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h2 className="text-lg font-semibold mb-4">Solicitudes Pendientes</h2>
            <p className="text-gray-600">Ver solicitudes pendientes de aprobación</p>
          </div>
        </Link>

        <Link href="/admin/reports/expiring-contracts">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h2 className="text-lg font-semibold mb-4">Contratos por Vencer</h2>
            <p className="text-gray-600">Ver contratos próximos a vencer</p>
          </div>
        </Link>
      </div>
    </>
  )
}
