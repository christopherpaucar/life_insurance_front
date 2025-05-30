export enum ContractStatus {
  DRAFT = 'draft',
  AWAITING_CLIENT_CONFIRMATION = 'awaiting_client_confirmation',
  PENDING_BASIC_DOCUMENTS = 'pending_basic_documents',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  INACTIVE = 'inactive',
}

export enum PaymentFrequency {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export enum AttachmentType {
  IDENTIFICATION = 'identification',
  MEDICAL_RECORD = 'medical_record',
  MEDICAL_EXAM = 'medical_exam',
  CONTRACT = 'contract',
  REIMBURSEMENT = 'reimbursement',
  INVOICE = 'invoice',
  OTHER = 'other',
}

export enum TransactionStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
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
  attachments: {
    fileName: string
    fileUrl: string
    type: AttachmentType
    description?: string
  }[]
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
    firstName: string
    lastName: string
    percentage: number
    contactInfo: string
    relationship: string
  }>
  transactions: Array<{
    id: string
    amount: number
    nextPaymentDate: string
    status: TransactionStatus
    retryCount: number
    nextRetryPaymentDate?: string
  }>
}
