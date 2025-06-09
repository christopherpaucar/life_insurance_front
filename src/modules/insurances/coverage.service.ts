import { getHttpClient } from '@/lib/http'
import { ApiResponse, CreateCoverageDto, UpdateCoverageDto } from './dtos/insurance.dtos'
import { ICoverage } from './interfaces/insurance.interfaces'

const api = await getHttpClient()

export const coverageService = {
  getCoverages: async (): Promise<ApiResponse<ICoverage[]>> => {
    const response = await api.get<ApiResponse<ICoverage[]>>(`/coverages`)
    return response.data
  },

  getCoverage: async (id: string): Promise<ApiResponse<ICoverage>> => {
    const response = await api.get<ApiResponse<ICoverage>>(`/coverages/${id}`)
    return response.data
  },

  createCoverage: async (data: CreateCoverageDto): Promise<ApiResponse<ICoverage>> => {
    const response = await api.post<ApiResponse<ICoverage>>(`/coverages`, data)
    return response.data
  },

  updateCoverage: async (id: string, data: UpdateCoverageDto): Promise<ApiResponse<ICoverage>> => {
    const response = await api.put<ApiResponse<ICoverage>>(`/coverages/${id}`, data)
    return response.data
  },

  deleteCoverage: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/coverages/${id}`)
    return response.data
  },
}
