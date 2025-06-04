'use client'

import React from 'react'
import { InsuranceDetailsSell } from '@/modules/insurances/components/InsuranceDetailsSell'

interface PageProps {
  params: Promise<{
    id: string
    role: string
  }>
}

export default function InsuranceDetailsPage({ params }: PageProps) {
  const unwrappedParams = React.use(params)

  return (
    <div className="container py-6">
      <InsuranceDetailsSell insuranceId={unwrappedParams.id} />
    </div>
  )
}
