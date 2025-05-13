'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function AdminDashboardPage() {
  return (
    <DashboardLayout title="Admin Dashboard" description="Manage system settings and monitor performance">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="User Management"
          description="Manage system users and their permissions"
          actionLabel="Manage Users"
          onAction={() => console.log('Navigate to users')}
        />

        <DashboardCard
          title="Policy Management"
          description="Configure insurance policies and rates"
          actionLabel="Manage Policies"
          onAction={() => console.log('Navigate to policies')}
        />

        <DashboardCard
          title="System Reports"
          description="View and generate system-wide reports"
          actionLabel="View Reports"
          onAction={() => console.log('Navigate to reports')}
        />
      </div>
    </DashboardLayout>
  )
}
