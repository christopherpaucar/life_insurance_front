import { useMutation } from '@tanstack/react-query'
import { getHttpClient } from '../../../lib/http'

interface CreateContractData {
  insuranceId: string
  startDate: string
  endDate: string
  totalAmount?: number
  paymentFrequency: string
  beneficiaries: Array<{
    name: string
    relationship: string
    percentage: number
    contactInfo?: string
  }>
  notes?: string
}

const api = getHttpClient()

export function useCreateContract({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  return useMutation({
    mutationFn: async (data: CreateContractData) => {
      const response = await api.post('/contracts', data)
      return response.data
    },
    onSuccess,
    onError,
  })
}
