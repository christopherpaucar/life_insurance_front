/* eslint-disable @typescript-eslint/no-explicit-any */
import { getHttpClient } from '@/lib/http'
import {
  CreateInsuranceDto,
  Insurance,
  UpdateInsuranceDto,
  ApiResponse,
} from './insurances.interfaces'

export const insurancesService = {
  getInsurances: async (params?: any): Promise<ApiResponse<Insurance[]>> => {
    const response = await getHttpClient().get<ApiResponse<Insurance[]>>('/insurances', { params })
    return response.data
  },

  getInsurance: async (id: string): Promise<ApiResponse<Insurance>> => {
    const response = await getHttpClient().get<ApiResponse<Insurance>>(`/insurances/${id}`)
    return response.data
  },

  createInsurance: async (data: CreateInsuranceDto): Promise<ApiResponse<Insurance>> => {
    const response = await getHttpClient().post<ApiResponse<Insurance>>('/insurances', data)
    return response.data
  },

  updateInsurance: async (
    id: string,
    data: UpdateInsuranceDto
  ): Promise<ApiResponse<Insurance>> => {
    const response = await getHttpClient().put<ApiResponse<Insurance>>(`/insurances/${id}`, data)
    return response.data
  },

  deleteInsurance: async (id: string): Promise<ApiResponse<void>> => {
    const response = await getHttpClient().delete<ApiResponse<void>>(`/insurances/${id}`)
    return response.data
  },
}
