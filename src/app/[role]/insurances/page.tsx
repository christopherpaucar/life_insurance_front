'use client';

import { InsurancePlans } from '@/modules/insurances/components/InsurancePlans';
import { useParams } from 'next/navigation';
import React from 'react';

export default function InsurancePlansPage() {
  const params = useParams();
  const role = params.role as string;

  return (
    <div className="container py-2">
      <InsurancePlans role={role} />
    </div>
  );
}
