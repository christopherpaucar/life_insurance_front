export interface Insurance {
  id: string
  name: string
  description: string
  price: number
  duration: number
  isActive: boolean
  coverages?: Coverage[]
  benefits?: Benefit[]
  createdAt: string
  updatedAt: string
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
  price: number
  duration: number
  isActive?: boolean
}

export interface UpdateInsuranceDto {
  name?: string
  description?: string
  price?: number
  duration?: number
  isActive?: boolean
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
