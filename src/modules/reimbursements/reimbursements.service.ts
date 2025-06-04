import { getHttpClient } from '@/lib/http'
import { ApiResponse } from '../insurances'
import {
  IReimbursement,
  ICreateReimbursement,
  IUpdateReimbursement,
  IReviewReimbursement,
} from './reimbursements.interfaces'

const api = await getHttpClient()

export const reimbursementsService = {
  getReimbursements: async (params?: any): Promise<ApiResponse<IReimbursement[]>> => {
    const response = await api.get<ApiResponse<IReimbursement[]>>('/reimbursements', { params })
    return response.data
  },

  getReimbursement: async (id: string): Promise<ApiResponse<IReimbursement>> => {
    const response = await api.get<ApiResponse<IReimbursement>>(`/reimbursements/${id}`)
    return response.data
  },

  createReimbursement: async (
    data: ICreateReimbursement,
    files?: File[]
  ): Promise<ApiResponse<IReimbursement>> => {
    const formData = new FormData()
    formData.append('contractId', data.contractId)
    formData.append('items', JSON.stringify(data.items))

    if (files) {
      files.forEach((file) => {
        formData.append('invoices', file)
      })
    }

    const response = await api.post<ApiResponse<IReimbursement>>('/reimbursements', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  updateReimbursement: async (
    id: string,
    data: IUpdateReimbursement
  ): Promise<ApiResponse<IReimbursement>> => {
    const response = await api.put<ApiResponse<IReimbursement>>(`/reimbursements/${id}`, data)
    return response.data
  },

  reviewReimbursement: async (
    id: string,
    data: IReviewReimbursement
  ): Promise<ApiResponse<IReimbursement>> => {
    const response = await api.put<ApiResponse<IReimbursement>>(
      `/reimbursements/${id}/review`,
      data
    )
    return response.data
  },

  deleteReimbursement: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/reimbursements/${id}`)
    return response.data
  },
}
