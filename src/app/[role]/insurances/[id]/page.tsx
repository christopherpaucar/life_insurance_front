'use client';

import React from 'react';
import { InsuranceDetails } from '@/modules/insurances/components/InsuranceDetails';

interface InsuranceDetailsPageProps {
  params: {
    id: string;
    role: string;
  };
}

export default function InsuranceDetailsPage({ params }: InsuranceDetailsPageProps) {
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;

  return (
    <div className="container py-6">
      <InsuranceDetails insuranceId={unwrappedParams.id} />
    </div>
  );
}
