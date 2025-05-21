'use client'

import { ContractList } from '@/modules/contracts/components/ContractList'

export default function MyInsurancesPage() {
  return (
    <div className="mt-4 container mx-auto">
      <h1 className="text-2xl font-bold">Mis Seguros</h1>
      <ContractList />
    </div>
  )
}
