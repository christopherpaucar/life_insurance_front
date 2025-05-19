export enum ContractStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  PENDING_SIGNATURE = 'pending_signature',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum PaymentFrequency {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export interface Contract {
  id: string
  contractNumber: string
  status: ContractStatus
  startDate: string
  endDate: string
  totalAmount: number
  paymentFrequency: PaymentFrequency
  installmentAmount: number
  signatureUrl?: string
  signedAt?: string
  notes?: string
  insurance: {
    id: string
    name: string
  }
  client: {
    id: string
    name: string
  }
  beneficiaries: Array<{
    id: string
    name: string
    percentage: number
  }>
}
