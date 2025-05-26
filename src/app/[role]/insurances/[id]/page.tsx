'use client'

import React from 'react'
import { InsuranceDetailsSell } from '@/modules/insurances/components/InsuranceDetailsSell'

interface InsuranceDetailsPageProps {
  params: {
    id: string
    role: string
  }
}

export default function InsuranceDetailsPage({ params }: InsuranceDetailsPageProps) {
  const unwrappedParams = params instanceof Promise ? React.use(params) : params

  return (
    <div className="container py-6">
      <InsuranceDetailsSell insuranceId={unwrappedParams.id} />
    </div>
  )
}
