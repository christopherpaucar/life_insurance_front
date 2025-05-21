export enum ContractStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  PENDING_SIGNATURE = 'pending_signature',
  PENDING_BASIC_DOCUMENTS = 'pending_basic_documents',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
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
}
