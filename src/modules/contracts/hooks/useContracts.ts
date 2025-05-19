import { useQuery } from '@tanstack/react-query'
import { Contract, ContractStatus } from '../types'
import { getHttpClient } from '../../../lib/http'
import { ApiResponse } from '../../insurances/insurances.interfaces'

interface UseContractsParams {
  status?: ContractStatus
}

const api = getHttpClient()

export function useContracts({ status }: UseContractsParams = {}) {
  const getContractsQuery = useQuery<Contract[]>({
    queryKey: ['contracts', status],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (status) {
        params.append('status', status)
      }
      const { data } = await api.get<ApiResponse<Contract[]>>(`/contracts?${params.toString()}`)
      return data.data
    },
  })

  return { contracts: getContractsQuery.data, isLoading: getContractsQuery.isLoading }
}
