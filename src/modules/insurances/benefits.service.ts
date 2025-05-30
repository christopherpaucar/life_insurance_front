import { getHttpClient } from '@/lib/http'
import { ApiResponse, CreateBenefitDto, UpdateBenefitDto } from './dtos/insurance.dtos'
import { IBenefit } from './interfaces/insurance.interfaces'

const api = await getHttpClient()

export const benefitsService = {
  getBenefits: async (): Promise<ApiResponse<IBenefit[]>> => {
    const response = await api.get<ApiResponse<IBenefit[]>>(`/benefits`)
    return response.data
  },

  getBenefit: async (id: string): Promise<ApiResponse<IBenefit>> => {
    const response = await api.get<ApiResponse<IBenefit>>(`/benefits/${id}`)
    return response.data
  },

  createBenefit: async (data: CreateBenefitDto): Promise<ApiResponse<IBenefit>> => {
    const response = await api.post<ApiResponse<IBenefit>>(`/benefits`, data)
    return response.data
  },

  updateBenefit: async (id: string, data: UpdateBenefitDto): Promise<ApiResponse<IBenefit>> => {
    const response = await api.put<ApiResponse<IBenefit>>(`/benefits/${id}`, data)
    return response.data
  },

  deleteBenefit: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/benefits/${id}`)
    return response.data
  },
}
