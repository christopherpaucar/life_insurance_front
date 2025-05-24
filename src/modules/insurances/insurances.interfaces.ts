export enum InsuranceType {
  LIFE = 'life',
  HEALTH = 'health',
}

export enum PaymentFrequency {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'yearly',
}

const enumLabels = {
  [InsuranceType.LIFE]: 'Vida',
  [InsuranceType.HEALTH]: 'Salud',
  [PaymentFrequency.MONTHLY]: 'Mensual',
  [PaymentFrequency.QUARTERLY]: 'Trimestral',
  [PaymentFrequency.ANNUAL]: 'Anual',
}

export const getEnumLabel = (enumValue: string) => {
  return enumLabels[enumValue as keyof typeof enumLabels]
}

export interface Insurance {
  id: string
  name: string
  description: string
  type: InsuranceType
  basePrice: number
  requirements: string[]
  availablePaymentFrequencies: PaymentFrequency[]
  coverages: InsuranceCoverage[]
  benefits: InsuranceBenefit[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  rank: number
}

export interface InsuranceCoverage {
  id: string
  name: string
  description: string
  coverageAmount: number
  additionalCost: number
  insurance: Insurance
  createdAt: string
  updatedAt: string
}

export interface InsuranceBenefit {
  id: string
  name: string
  description: string
  additionalCost: number
  insurance: Insurance
  createdAt: string
  updatedAt: string
}

export interface CreateInsuranceDto {
  name: string
  description: string
  type: InsuranceType
  basePrice: number
  rank: number
  requirements?: string[]
  availablePaymentFrequencies?: PaymentFrequency[]
}

export interface UpdateInsuranceDto {
  name?: string
  description?: string
  type?: InsuranceType
  basePrice?: number
  requirements?: string[]
  rank?: number
  availablePaymentFrequencies?: PaymentFrequency[]
}

export interface CreateInsuranceCoverageDto {
  name: string
  description: string
  coverageAmount: number
  additionalCost: number
}

export interface UpdateInsuranceCoverageDto {
  name?: string
  description?: string
  coverageAmount?: number
  additionalCost?: number
}

export interface CreateInsuranceBenefitDto {
  name: string
  description: string
  additionalCost: number
}

export interface UpdateInsuranceBenefitDto {
  name?: string
  description?: string
  additionalCost?: number
}

export interface InsuranceQueryParams {
  page?: number
  limit?: number
  includeInactive?: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface InsurancesState {
  insurances: Insurance[]
  selectedInsurance: Insurance | null
  loading: boolean
  error: string | null
}
