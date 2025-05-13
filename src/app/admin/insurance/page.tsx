'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function AdminInsurancePage() {
  return (
    <DashboardLayout title="Gestión de Seguros" description="Administre planes, coberturas y primas">
      <DashboardCard title="Planes de Seguro" description="Configure planes de seguro, coberturas y primas">
        {/* Insurance management interface would go here */}
      </DashboardCard>
    </DashboardLayout>
  )
}
