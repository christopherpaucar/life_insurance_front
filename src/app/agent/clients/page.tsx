'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { ClientsTable } from '@/modules/clients/components/ClientsTable'

export default function AgentClientsPage() {
  return (
    <DashboardLayout
      title="Gestión de Clientes"
      description="Administre la información de los clientes"
    >
      <ClientsTable
        title="Gestión de Clientes"
        description="Administre la información de los clientes"
      />
    </DashboardLayout>
  )
}
