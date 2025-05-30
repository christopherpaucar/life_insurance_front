import { useQuery } from '@tanstack/react-query'
import { QueryParams } from '../payment_methods/payment-methods.interfaces'
import { paymentsService } from './payments.service'

export const PAYMENTS_QUERY_KEYS = {
  all: ['payments'] as const,
  list: (params?: QueryParams) => [...PAYMENTS_QUERY_KEYS.all, 'list', params] as const,
}

export const usePayments = (params?: QueryParams) => {
  const getPaymentsQuery = useQuery({
    queryKey: PAYMENTS_QUERY_KEYS.list(params),
    queryFn: () => paymentsService.getHistory(params),
  })

  return {
    payments: getPaymentsQuery.data?.data ?? [],
    meta: getPaymentsQuery.data?.meta,
    isLoading: getPaymentsQuery.isLoading,
    isError: getPaymentsQuery.isError,
    error: getPaymentsQuery.error,
    refetch: getPaymentsQuery.refetch,
  }
}
