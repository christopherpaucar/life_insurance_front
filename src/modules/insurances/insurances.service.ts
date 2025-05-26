/* eslint-disable @typescript-eslint/no-explicit-any */
import { getHttpClient } from '@/lib/http'
import {
  CreateInsuranceDto,
  IInsurance,
  UpdateInsuranceDto,
  ApiResponse,
} from './insurances.interfaces'

export const insurancesService = {
  getInsurances: async (params?: any): Promise<ApiResponse<IInsurance[]>> => {
    const response = await getHttpClient().get<ApiResponse<IInsurance[]>>('/insurances', { params })
    return response.data
  },

  getInsurance: async (id: string): Promise<ApiResponse<IInsurance>> => {
    const response = await getHttpClient().get<ApiResponse<IInsurance>>(`/insurances/${id}`)
    return response.data
  },

  createInsurance: async (data: CreateInsuranceDto): Promise<ApiResponse<IInsurance>> => {
    const response = await getHttpClient().post<ApiResponse<IInsurance>>('/insurances', data)
    return response.data
  },

  updateInsurance: async (
    id: string,
    data: UpdateInsuranceDto
  ): Promise<ApiResponse<IInsurance>> => {
    const response = await getHttpClient().put<ApiResponse<IInsurance>>(`/insurances/${id}`, data)
    return response.data
  },

  deleteInsurance: async (id: string): Promise<ApiResponse<void>> => {
    const response = await getHttpClient().delete<ApiResponse<void>>(`/insurances/${id}`)
    return response.data
  },
}
