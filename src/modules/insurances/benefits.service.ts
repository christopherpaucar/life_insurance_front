import { getHttpClient } from '@/lib/http'
import { ApiResponse, Benefit, CreateBenefitDto } from './insurances.interfaces'
import { UpdateBenefitDto } from './insurances.interfaces'

export const benefitsService = {
  getBenefits: async (): Promise<ApiResponse<Benefit[]>> => {
    const response = await getHttpClient().get<ApiResponse<Benefit[]>>(`/benefits`)
    return response.data
  },

  getBenefit: async (id: string): Promise<ApiResponse<Benefit>> => {
    const response = await getHttpClient().get<ApiResponse<Benefit>>(`/benefits/${id}`)
    return response.data
  },

  createBenefit: async (data: CreateBenefitDto): Promise<ApiResponse<Benefit>> => {
    const response = await getHttpClient().post<ApiResponse<Benefit>>(`/benefits`, data)
    return response.data
  },

  updateBenefit: async (id: string, data: UpdateBenefitDto): Promise<ApiResponse<Benefit>> => {
    const response = await getHttpClient().put<ApiResponse<Benefit>>(`/benefits/${id}`, data)
    return response.data
  },

  deleteBenefit: async (id: string): Promise<ApiResponse<void>> => {
    const response = await getHttpClient().delete<ApiResponse<void>>(`/benefits/${id}`)
    return response.data
  },
}
