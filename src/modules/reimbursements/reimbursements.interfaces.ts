export enum ReimbursementStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  PARTIALLY_APPROVED = 'partially_approved',
  REJECTED = 'rejected',
  PAID = 'paid',
}

export enum ReimbursementItemType {
  MEDICATION = 'medication',
  CONSULTATION = 'consultation',
  SURGERY = 'surgery',
  DIAGNOSTIC = 'diagnostic',
  HOSPITALIZATION = 'hospitalization',
  OTHER = 'other',
}

export enum ReimbursementItemStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface IReimbursementItem {
  id: string
  type: ReimbursementItemType
  description: string
  serviceDate: string
  requestedAmount: number
  approvedAmount: number
  status: ReimbursementItemStatus
  rejectionReason?: string
  documentUrl?: string
}

export interface IReimbursement {
  id: string
  requestNumber: string
  status: ReimbursementStatus
  reviewerNotes?: string
  totalRequestedAmount: number
  totalApprovedAmount: number
  paidAt?: string
  reviewedAt?: string
  reviewerId?: string
  createdAt: string
  updatedAt: string
  items: IReimbursementItem[]
}

export interface ICreateReimbursementItem {
  description: string
  type: ReimbursementItemType
  serviceDate: string
  requestedAmount: number
  documentUrl?: string
}

export interface ICreateReimbursement {
  contractId: string
  items: ICreateReimbursementItem[]
}

export interface IUpdateReimbursementItem {
  id: string
  description?: string
  requestedAmount?: number
  documentUrl?: string
}

export interface IUpdateReimbursement {
  notes?: string
  items?: IUpdateReimbursementItem[]
}

export interface IReviewReimbursementItem {
  id: string
  status: ReimbursementItemStatus
  approvedAmount?: number
  rejectionReason?: string
}

export interface IReviewReimbursement {
  status: ReimbursementStatus
  reviewerNotes?: string
  items?: IReviewReimbursementItem[]
}
