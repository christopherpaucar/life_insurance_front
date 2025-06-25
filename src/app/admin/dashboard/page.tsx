'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          actionLabel="Manage Users"
          onAction={() => console.log('Navigate to users')}
        >
          <h3 className="text-xl font-semibold">User Management</h3>
          <p className="text-muted-foreground mt-2">
            View, create, and manage user accounts and roles.
          </p>
        </DashboardCard>
        <DashboardCard
          actionLabel="Manage Insurances"
          onAction={() => console.log('Navigate to insurances')}
        >
          <h3 className="text-xl font-semibold">Insurance Plans</h3>
          <p className="text-muted-foreground mt-2">
            Configure and manage insurance plans and coverages.
          </p>
        </DashboardCard>
        <DashboardCard
          actionLabel="View Reports"
          onAction={() => console.log('Navigate to reports')}
        >
          <h3 className="text-xl font-semibold">System Reports</h3>
          <p className="text-muted-foreground mt-2">
            Generate and view system-wide reports and analytics.
          </p>
        </DashboardCard>
      </div>
    </div>
  )
}
