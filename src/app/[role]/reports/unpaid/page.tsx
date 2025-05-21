'use client';

import React from 'react';
import { ReportCard } from '@/components/reports/ReportCard';

interface UnpaidReportsPageProps {
  params: {
    role: string;
  };
}

export default function UnpaidReportsPage({ params }: UnpaidReportsPageProps) {
  const role = params.role;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Seguros Impagos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard
          title="Pagos Vencidos"
          description="Ver seguros con pagos vencidos"
          href={`/${role}/reports/unpaid/overdue`}
        />
        <ReportCard
          title="Próximos a Vencer"
          description="Ver seguros con pagos próximos a vencer"
          href={`/${role}/reports/unpaid/upcoming`}
        />
        <ReportCard
          title="Historial de Impagos"
          description="Ver historial de pagos impagos"
          href={`/${role}/reports/unpaid/history`}
        />
      </div>
    </div>
  );
}
