export enum InsuranceType {
  LIFE = 'LIFE',
  HEALTH = 'HEALTH',
}

export enum PaymentFrequency {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
}

const enumLabels = {
  [InsuranceType.LIFE]: 'Vida',
  [InsuranceType.HEALTH]: 'Salud',
  [PaymentFrequency.MONTHLY]: 'Mensual',
  [PaymentFrequency.QUARTERLY]: 'Trimestral',
  [PaymentFrequency.ANNUAL]: 'Anual',
}

export const getEnumLabel = (enumValue: string) => {
  return enumLabels[enumValue.toUpperCase() as keyof typeof enumLabels]
}

export interface Insurance {
  id: string
  name: string
  description: string
  basePrice: number
  duration: number
  isActive: boolean
  coverages?: Coverage[]
  benefits?: Benefit[]
  createdAt: string
  updatedAt: string
  type: InsuranceType
  requirements?: string[]
  availablePaymentFrequencies?: PaymentFrequency[]
}

export interface Coverage {
  id: string
  name: string
  description: string
  coverageLimit: number
  isActive: boolean
}

export interface Benefit {
  id: string
  name: string
  description: string
  isActive: boolean
}

export interface CreateInsuranceDto {
  name: string
  description: string
  type: InsuranceType
  basePrice: number
  isActive?: boolean
  requirements?: string[]
  availablePaymentFrequencies?: PaymentFrequency[]
}

export interface UpdateInsuranceDto {
  name?: string
  description?: string
  type?: InsuranceType
  basePrice?: number
  isActive?: boolean
  requirements?: string[]
  availablePaymentFrequencies?: PaymentFrequency[]
}

export interface InsuranceQueryParams {
  page?: number
  limit?: number
  includeInactive?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
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
