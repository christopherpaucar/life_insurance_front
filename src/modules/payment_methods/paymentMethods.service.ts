import { getHttpClient } from '@/lib/http'
import { CreatePaymentMethodDto, IPaymentMethod, QueryParams } from './payment-methods.interfaces'
import { PaginatedResponse } from '../users/users.interfaces'

const httpClient = await getHttpClient()

export const paymentMethodsService = {
  getPaymentMethods: async (params?: QueryParams): Promise<PaginatedResponse<IPaymentMethod>> => {
    const response = await httpClient.get<PaginatedResponse<IPaymentMethod>>('/payment-methods', {
      params,
    })
    return {
      ...response.data,
      data: response.data.data.map((item) => ({
        ...item,
        details: JSON.parse(item.details as unknown as string),
      })),
    }
  },

  getPaymentMethod: async (id: string): Promise<IPaymentMethod> => {
    const response = await httpClient.get<{ data: IPaymentMethod }>(`/payment-methods/${id}`)
    return response.data.data
  },

  createPaymentMethod: async (paymentMethod: CreatePaymentMethodDto): Promise<IPaymentMethod> => {
    const response = await httpClient.post<{ data: IPaymentMethod }>('/payment-methods', {
      ...paymentMethod,
      details: JSON.stringify(paymentMethod.details),
    })
    return response.data.data
  },

  updatePaymentMethod: async (
    id: string,
    paymentMethod: Partial<CreatePaymentMethodDto>
  ): Promise<IPaymentMethod> => {
    if (paymentMethod.details) {
      // @ts-expect-error - details is a string
      paymentMethod.details = JSON.stringify(paymentMethod.details)
    }

    const response = await httpClient.put<{ data: IPaymentMethod }>(
      `/payment-methods/${id}`,
      paymentMethod
    )
    return response.data.data
  },

  deletePaymentMethod: async (id: string): Promise<void> => {
    await httpClient.delete(`/payment-methods/${id}`)
  },
}
