'use client'

import { PaymentsTable } from '@/modules/payments/components/PaymentsTable'

export default function PaymentsPage() {
  return (
    <div className="container py-4">
      <h1 className="text-2xl font-bold mb-4">Pagos</h1>
      <PaymentsTable />
    </div>
  )
}
