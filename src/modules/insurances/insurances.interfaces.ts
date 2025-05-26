export interface InsuranceCoverageRelationDto {
  id: string
  coverageAmount: number
  additionalCost: number
  delete?: boolean
}

export interface InsuranceBenefitRelationDto {
  id: string
  additionalCost: number
  delete?: boolean
}

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
  coverages: (InsuranceCoverageRelationDto & { coverage: ICoverage })[]
  benefits: (InsuranceBenefitRelationDto & { benefit: IBenefit })[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  order: number
}

export interface ICoverage {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  additionalCost?: number
  coverageAmount?: number
}

export interface IBenefit {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  additionalCost?: number
}

export interface CreateInsuranceDto {
  name: string
  description: string
  type: InsuranceType
  basePrice: number
  order: number
  requirements?: string[]
  availablePaymentFrequencies?: PaymentFrequency[]
  coverages?: InsuranceCoverageRelationDto[]
  benefits?: InsuranceBenefitRelationDto[]
}

export interface UpdateInsuranceDto {
  name?: string
  description?: string
  type?: InsuranceType
  basePrice?: number
  requirements?: string[]
  order?: number
  availablePaymentFrequencies?: PaymentFrequency[]
  coverages?: InsuranceCoverageRelationDto[]
  benefits?: InsuranceBenefitRelationDto[]
}

export interface CreateCoverageDto {
  name: string
  description: string
}

export interface UpdateCoverageDto {
  name?: string
  description?: string
}

export interface CreateBenefitDto {
  name: string
  description: string
}

export interface UpdateBenefitDto {
  name?: string
  description?: string
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
