import { HttpClient } from '@/lib/http'
import {
  CreateInsuranceDto,
  InsuranceQueryParams,
  PaginatedResponse,
  Insurance,
  UpdateInsuranceDto,
} from './insurances.interfaces'

const httpClient = new HttpClient()

export const insurancesService = {
  getInsurances: async (params?: InsuranceQueryParams): Promise<PaginatedResponse<Insurance>> => {
    const response = await httpClient.get<PaginatedResponse<Insurance>>('/insurances', { params })
    return response.data
  },

  getInsurance: async (id: string): Promise<Insurance> => {
    const response = await httpClient.get<{ data: Insurance }>(`/insurances/${id}`)
    return response.data.data
  },

  createInsurance: async (insurance: CreateInsuranceDto): Promise<Insurance> => {
    const response = await httpClient.post<{ data: Insurance }>('/insurances', insurance)
    return response.data.data
  },

  updateInsurance: async (id: string, insurance: UpdateInsuranceDto): Promise<Insurance> => {
    const response = await httpClient.put<{ data: Insurance }>(`/insurances/${id}`, insurance)
    return response.data.data
  },

  deleteInsurance: async (id: string): Promise<void> => {
    await httpClient.delete(`/insurances/${id}`)
  },
}
