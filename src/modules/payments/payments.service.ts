import { getHttpClient } from '@/lib/http'
import { PaginatedResponse } from '../users/users.interfaces'
import { QueryParams } from '../payment_methods/payment-methods.interfaces'
import { ITransaction } from './payments.interface'

const httpClient = await getHttpClient()

export const paymentsService = {
  getHistory: async (params?: QueryParams): Promise<PaginatedResponse<ITransaction>> => {
    const response = await httpClient.get<PaginatedResponse<ITransaction>>('/payments', {
      params,
    })
    return response.data
  },
}
