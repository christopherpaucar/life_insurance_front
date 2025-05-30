import { InsuranceType, PaymentFrequency } from '../enums/insurance.enums'

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

export interface IInsurance {
  id: string
  name: string
  description: string
  type: InsuranceType
  requirements: string[]
  coverages: (InsuranceCoverageRelationDto & { coverage: ICoverage })[]
  benefits: (InsuranceBenefitRelationDto & { benefit: IBenefit })[]
  prices: {
    price: number
    frequency: PaymentFrequency
  }[]
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

export interface InsurancesState {
  insurances: IInsurance[]
  selectedInsurance: IInsurance | null
  loading: boolean
  error: string | null
}
