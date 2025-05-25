'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { BenefitsTable } from '@/modules/insurances/components/BenefitsTable'

export default function AdminBenefitsPage() {
  return (
    <DashboardLayout
      title="Gestión de Beneficios"
      description="Administre la información de los beneficios"
    >
      <BenefitsTable />
    </DashboardLayout>
  )
}
