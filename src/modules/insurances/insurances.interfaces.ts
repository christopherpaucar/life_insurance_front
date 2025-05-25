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

export interface IInsurance {
  id: string
  name: string
  description: string
  type: InsuranceType
  basePrice: number
  requirements: string[]
  availablePaymentFrequencies: PaymentFrequency[]
  coverages: ICoverage[]
  benefits: IBenefit[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  order: number
}

export interface ICoverage {
  id: string
  name: string
  description: string
  coverageAmount: number
  additionalCost: number
  createdAt: string
  updatedAt: string
}

export interface IBenefit {
  id: string
  name: string
  description: string
  additionalCost: number
  createdAt: string
  updatedAt: string
}

export interface CreateInsuranceDto {
  name: string
  description: string
  type: InsuranceType
  basePrice: number
  order: number
  requirements?: string[]
  availablePaymentFrequencies?: PaymentFrequency[]
  coverageIds?: string[]
  benefitIds?: string[]
}

export interface UpdateInsuranceDto {
  name?: string
  description?: string
  type?: InsuranceType
  basePrice?: number
  requirements?: string[]
  order?: number
  availablePaymentFrequencies?: PaymentFrequency[]
  coverageIds?: string[]
  benefitIds?: string[]
}

export interface CreateCoverageDto {
  name: string
  description: string
  coverageAmount: number
  additionalCost: number
}

export interface UpdateCoverageDto {
  name?: string
  description?: string
  coverageAmount?: number
  additionalCost?: number
}

export interface CreateBenefitDto {
  name: string
  description: string
  additionalCost: number
}

export interface UpdateBenefitDto {
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
  insurances: IInsurance[]
  selectedInsurance: IInsurance | null
  loading: boolean
  error: string | null
}
