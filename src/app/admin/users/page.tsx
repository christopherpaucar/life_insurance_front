'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { UsersTable } from '@/modules/users/components/UsersTable'

export default function AdminUsersPage() {
  return (
    <DashboardLayout
      title="Gestión de Usuarios"
      description="Administre la información de los usuarios"
    >
      <UsersTable />
    </DashboardLayout>
  )
}
