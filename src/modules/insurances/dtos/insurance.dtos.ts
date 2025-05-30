import { InsuranceType, PaymentFrequency } from '../enums/insurance.enums'
import {
  InsuranceCoverageRelationDto,
  InsuranceBenefitRelationDto,
} from '../interfaces/insurance.interfaces'

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
