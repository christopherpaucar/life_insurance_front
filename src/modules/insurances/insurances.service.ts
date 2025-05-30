/* eslint-disable @typescript-eslint/no-explicit-any */
import { getHttpClient } from '@/lib/http'
import { CreateInsuranceDto, UpdateInsuranceDto, ApiResponse } from './dtos/insurance.dtos'
import { IInsurance } from './interfaces/insurance.interfaces'

const api = await getHttpClient()

export const insurancesService = {
  getInsurances: async (params?: any): Promise<ApiResponse<IInsurance[]>> => {
    const response = await api.get<ApiResponse<IInsurance[]>>('/insurances', { params })
    return response.data
  },

  getInsurance: async (id: string): Promise<ApiResponse<IInsurance>> => {
    const response = await api.get<ApiResponse<IInsurance>>(`/insurances/${id}`)
    return response.data
  },

  createInsurance: async (data: CreateInsuranceDto): Promise<ApiResponse<IInsurance>> => {
    const response = await api.post<ApiResponse<IInsurance>>('/insurances', data)
    return response.data
  },

  updateInsurance: async (
    id: string,
    data: UpdateInsuranceDto
  ): Promise<ApiResponse<IInsurance>> => {
    const response = await api.put<ApiResponse<IInsurance>>(`/insurances/${id}`, data)
    return response.data
  },

  deleteInsurance: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/insurances/${id}`)
    return response.data
  },
}
