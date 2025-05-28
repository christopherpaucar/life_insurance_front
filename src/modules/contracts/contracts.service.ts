import { getHttpClient } from '@/lib/http'
import { Contract } from './types'
import { ApiResponse } from '../insurances/insurances.interfaces'

export const contractsService = {
  getContracts: async (params?: any): Promise<ApiResponse<Contract[]>> => {
    const api = getHttpClient()
    const response = await api.get<ApiResponse<Contract[]>>('/contracts', { params })
    return response.data
  },

  getContract: async (id: string): Promise<ApiResponse<Contract>> => {
    const api = getHttpClient()
    const response = await api.get<ApiResponse<Contract>>(`/contracts/${id}`)
    return response.data
  },

  createContract: async (data: any): Promise<ApiResponse<Contract>> => {
    const api = getHttpClient()
    const response = await api.post<ApiResponse<Contract>>('/contracts', data)
    return response.data
  },

  updateContract: async (id: string, data: any): Promise<ApiResponse<Contract>> => {
    const api = getHttpClient()
    const response = await api.put<ApiResponse<Contract>>(`/contracts/${id}`, data)
    return response.data
  },

  deleteContract: async (id: string): Promise<ApiResponse<void>> => {
    const api = getHttpClient()
    const response = await api.delete<ApiResponse<void>>(`/contracts/${id}`)
    return response.data
  },

  // Attachments
  getAttachments: async (contractId: string): Promise<ApiResponse<any[]>> => {
    const api = getHttpClient()
    const response = await api.get<ApiResponse<any[]>>(`/contracts/${contractId}/attachments`)
    return response.data
  },

  uploadAttachment: async (contractId: string, file: FormData): Promise<ApiResponse<void>> => {
    const api = getHttpClient()
    const response = await api.post<ApiResponse<void>>(
      `/contracts/${contractId}/attachments`,
      file,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  deleteAttachment: async (
    contractId: string,
    attachmentId: string
  ): Promise<ApiResponse<void>> => {
    const api = getHttpClient()
    const response = await api.delete<ApiResponse<void>>(
      `/contracts/${contractId}/attachments/${attachmentId}`
    )
    return response.data
  },

  // Signatures
  signContract: async (contractId: string): Promise<ApiResponse<void>> => {
    const api = getHttpClient()
    const response = await api.post<ApiResponse<void>>(`/contracts/${contractId}/sign`)
    return response.data
  },

  getSignature: async (contractId: string): Promise<ApiResponse<any>> => {
    const api = getHttpClient()
    const response = await api.get<ApiResponse<any>>(`/contracts/${contractId}/signature`)
    return response.data
  },

  // Beneficiaries
  getBeneficiaries: async (contractId: string): Promise<ApiResponse<any[]>> => {
    const api = getHttpClient()
    const response = await api.get<ApiResponse<any[]>>(`/contracts/${contractId}/beneficiaries`)
    return response.data
  },

  addBeneficiary: async (contractId: string, data: any): Promise<ApiResponse<any>> => {
    const api = getHttpClient()
    const response = await api.post<ApiResponse<any>>(
      `/contracts/${contractId}/beneficiaries`,
      data
    )
    return response.data
  },

  updateBeneficiary: async (
    contractId: string,
    beneficiaryId: string,
    data: any
  ): Promise<ApiResponse<any>> => {
    const api = getHttpClient()
    const response = await api.put<ApiResponse<any>>(
      `/contracts/${contractId}/beneficiaries/${beneficiaryId}`,
      data
    )
    return response.data
  },

  deleteBeneficiary: async (
    contractId: string,
    beneficiaryId: string
  ): Promise<ApiResponse<void>> => {
    const api = getHttpClient()
    const response = await api.delete<ApiResponse<void>>(
      `/contracts/${contractId}/beneficiaries/${beneficiaryId}`
    )
    return response.data
  },
}
