/* eslint-disable @typescript-eslint/no-explicit-any */
import { getHttpClient } from '@/lib/http'
import {
  CreateInsuranceDto,
  Insurance,
  UpdateInsuranceDto,
  ApiResponse,
  InsuranceBenefit,
  InsuranceCoverage,
  CreateInsuranceCoverageDto,
  UpdateInsuranceCoverageDto,
  CreateInsuranceBenefitDto,
  UpdateInsuranceBenefitDto,
} from './insurances.interfaces'

export const insurancesService = {
  getInsurances: async (params?: any): Promise<ApiResponse<Insurance[]>> => {
    const api = getHttpClient()
    const response = await api.get<ApiResponse<Insurance[]>>('/insurances', { params })
    return response.data
  },

  getInsurance: async (id: string): Promise<ApiResponse<Insurance>> => {
    const api = getHttpClient()
    const response = await api.get<ApiResponse<Insurance>>(`/insurances/${id}`)
    return response.data
  },

  createInsurance: async (data: CreateInsuranceDto): Promise<ApiResponse<Insurance>> => {
    const api = getHttpClient()
    const response = await api.post<ApiResponse<Insurance>>('/insurances', data)
    return response.data
  },

  updateInsurance: async (
    id: string,
    data: UpdateInsuranceDto
  ): Promise<ApiResponse<Insurance>> => {
    const api = getHttpClient()
    const response = await api.put<ApiResponse<Insurance>>(`/insurances/${id}`, data)
    return response.data
  },

  deleteInsurance: async (id: string): Promise<ApiResponse<void>> => {
    const api = getHttpClient()
    const response = await api.delete<ApiResponse<void>>(`/insurances/${id}`)
    return response.data
  },

  getCoverages: async (insuranceId: string): Promise<ApiResponse<InsuranceCoverage[]>> => {
    const api = getHttpClient()
    const response = await api.get<ApiResponse<InsuranceCoverage[]>>(
      `/insurances/${insuranceId}/coverages`
    )
    return response.data
  },

  getCoverage: async (insuranceId: string, id: string): Promise<ApiResponse<InsuranceCoverage>> => {
    const api = getHttpClient()
    const response = await api.get<ApiResponse<InsuranceCoverage>>(
      `/insurances/${insuranceId}/coverages/${id}`
    )
    return response.data
  },

  createCoverage: async (
    insuranceId: string,
    data: CreateInsuranceCoverageDto
  ): Promise<ApiResponse<InsuranceCoverage>> => {
    const api = getHttpClient()
    const response = await api.post<ApiResponse<InsuranceCoverage>>(
      `/insurances/${insuranceId}/coverages`,
      data
    )
    return response.data
  },

  updateCoverage: async (
    insuranceId: string,
    id: string,
    data: UpdateInsuranceCoverageDto
  ): Promise<ApiResponse<InsuranceCoverage>> => {
    const api = getHttpClient()
    const response = await api.put<ApiResponse<InsuranceCoverage>>(
      `/insurances/${insuranceId}/coverages/${id}`,
      data
    )
    return response.data
  },

  deleteCoverage: async (insuranceId: string, id: string): Promise<ApiResponse<void>> => {
    const api = getHttpClient()
    const response = await api.delete<ApiResponse<void>>(
      `/insurances/${insuranceId}/coverages/${id}`
    )
    return response.data
  },

  getBenefits: async (insuranceId: string): Promise<ApiResponse<InsuranceBenefit[]>> => {
    const api = getHttpClient()
    const response = await api.get<ApiResponse<InsuranceBenefit[]>>(
      `/insurances/${insuranceId}/benefits`
    )
    return response.data
  },

  getBenefit: async (insuranceId: string, id: string): Promise<ApiResponse<InsuranceBenefit>> => {
    const api = getHttpClient()
    const response = await api.get<ApiResponse<InsuranceBenefit>>(
      `/insurances/${insuranceId}/benefits/${id}`
    )
    return response.data
  },

  createBenefit: async (
    insuranceId: string,
    data: CreateInsuranceBenefitDto
  ): Promise<ApiResponse<InsuranceBenefit>> => {
    const api = getHttpClient()
    const response = await api.post<ApiResponse<InsuranceBenefit>>(
      `/insurances/${insuranceId}/benefits`,
      data
    )
    return response.data
  },

  updateBenefit: async (
    insuranceId: string,
    id: string,
    data: UpdateInsuranceBenefitDto
  ): Promise<ApiResponse<InsuranceBenefit>> => {
    const api = getHttpClient()
    const response = await api.put<ApiResponse<InsuranceBenefit>>(
      `/insurances/${insuranceId}/benefits/${id}`,
      data
    )
    return response.data
  },

  deleteBenefit: async (insuranceId: string, id: string): Promise<ApiResponse<void>> => {
    const api = getHttpClient()
    const response = await api.delete<ApiResponse<void>>(
      `/insurances/${insuranceId}/benefits/${id}`
    )
    return response.data
  },
}
