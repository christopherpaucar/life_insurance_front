'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { CoveragesTable } from '../../../../modules/insurances/components/CoveragesTable'

export default function AdminCoveragesPage() {
  return (
    <DashboardLayout
      title="Gestión de Coberturas"
      description="Administre la información de las coberturas"
    >
      <CoveragesTable />
    </DashboardLayout>
  )
}
