import { getHttpClient } from '@/lib/http'
import { ApiResponse, Coverage, CreateCoverageDto } from './insurances.interfaces'
import { UpdateCoverageDto } from './insurances.interfaces'

export const coverageService = {
  getCoverages: async (): Promise<ApiResponse<Coverage[]>> => {
    const response = await getHttpClient().get<ApiResponse<Coverage[]>>(`/coverages`)
    return response.data
  },

  getCoverage: async (id: string): Promise<ApiResponse<Coverage>> => {
    const response = await getHttpClient().get<ApiResponse<Coverage>>(`/coverages/${id}`)
    return response.data
  },

  createCoverage: async (data: CreateCoverageDto): Promise<ApiResponse<Coverage>> => {
    const response = await getHttpClient().post<ApiResponse<Coverage>>(`/coverages`, data)
    return response.data
  },

  updateCoverage: async (id: string, data: UpdateCoverageDto): Promise<ApiResponse<Coverage>> => {
    const response = await getHttpClient().put<ApiResponse<Coverage>>(`/coverages/${id}`, data)
    return response.data
  },

  deleteCoverage: async (id: string): Promise<ApiResponse<void>> => {
    const response = await getHttpClient().delete<ApiResponse<void>>(`/coverages/${id}`)
    return response.data
  },
}
