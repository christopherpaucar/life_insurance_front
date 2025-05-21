'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

export default function AgentDashboardPage() {
  return (
    <DashboardLayout
      title="Panel del Agente"
      description="Gestione clientes, contratos y reembolsos"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Clientes"
          description="Gestione la información de sus clientes"
          actionLabel="Ver Clientes"
          onAction={() => console.log('Navigate to clients')}
        />

        <DashboardCard
          title="Contratos"
          description="Administre contratos y pólizas"
          actionLabel="Ver Contratos"
          onAction={() => console.log('Navigate to contracts')}
        />

        <DashboardCard
          title="Reembolsos"
          description="Revise solicitudes de reembolso"
          actionLabel="Ver Solicitudes"
          onAction={() => console.log('Navigate to reimbursements')}
        />
      </div>
    </DashboardLayout>
  );
}
