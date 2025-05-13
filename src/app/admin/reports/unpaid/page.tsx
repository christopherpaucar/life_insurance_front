'use client'

import React from 'react'
import Link from 'next/link'

export default function AdminUnpaidReportsPage() {
  return (
    <>
      <div className="flex items-center mb-6">
        <Link href="/admin/reports" className="text-blue-600 hover:text-blue-800 mr-2">
          ← Volver a Reportes
        </Link>
        <h1 className="text-2xl font-bold">Reporte de Seguros Impagos</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
              <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option>Últimos 30 días</option>
                <option>Últimos 60 días</option>
                <option>Últimos 90 días</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de seguro</label>
              <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option>Todos</option>
                <option>Vida</option>
                <option>Salud</option>
                <option>Vehículo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option>Todos</option>
                <option>Atrasado {`>`} 30 días</option>
                <option>Atrasado {`>`} 60 días</option>
                <option>En mora</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Resultados</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Póliza
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Días de atraso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Este es un ejemplo. En una aplicación real, estos datos vendrían de una API */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Juan Pérez</td>
                  <td className="px-6 py-4 whitespace-nowrap">POL-2023-001</td>
                  <td className="px-6 py-4 whitespace-nowrap">Vida</td>
                  <td className="px-6 py-4 whitespace-nowrap">$1,200.00</td>
                  <td className="px-6 py-4 whitespace-nowrap">45</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-900">Contactar</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">María González</td>
                  <td className="px-6 py-4 whitespace-nowrap">POL-2023-042</td>
                  <td className="px-6 py-4 whitespace-nowrap">Salud</td>
                  <td className="px-6 py-4 whitespace-nowrap">$850.00</td>
                  <td className="px-6 py-4 whitespace-nowrap">62</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-900">Contactar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
