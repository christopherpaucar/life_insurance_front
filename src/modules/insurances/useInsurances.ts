import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CreateInsuranceDto, InsuranceQueryParams, UpdateInsuranceDto } from './insurances.interfaces'
import { insurancesService } from './insurances.service'
import { toast } from 'sonner'

export const INSURANCE_QUERY_KEYS = {
  all: ['insurances'] as const,
  list: (params?: InsuranceQueryParams) => [...INSURANCE_QUERY_KEYS.all, 'list', params] as const,
  detail: (id: string) => [...INSURANCE_QUERY_KEYS.all, 'detail', id] as const,
}

export const useInsurances = (params?: InsuranceQueryParams) => {
  const queryClient = useQueryClient()

  const getInsurancesQuery = useQuery({
    queryKey: INSURANCE_QUERY_KEYS.list(params),
    queryFn: () => insurancesService.getInsurances(params),
  })

  const createInsuranceMutation = useMutation({
    mutationFn: (insurance: CreateInsuranceDto) => insurancesService.createInsurance(insurance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.all })
      toast.success('Plan de seguro creado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear el plan de seguro')
      console.error(error)
    },
  })

  const updateInsuranceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInsuranceDto }) => insurancesService.updateInsurance(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.all })
      toast.success('Plan de seguro actualizado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar el plan de seguro')
      console.error(error)
    },
  })

  const deleteInsuranceMutation = useMutation({
    mutationFn: (id: string) => insurancesService.deleteInsurance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.all })
      toast.success('Plan de seguro eliminado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al eliminar el plan de seguro')
      console.error(error)
    },
  })

  return {
    insurances: getInsurancesQuery.data?.data ?? [],
    meta: getInsurancesQuery.data?.meta,
    isLoading: getInsurancesQuery.isLoading,
    isError: getInsurancesQuery.isError,
    error: getInsurancesQuery.error,
    refetch: getInsurancesQuery.refetch,

    createInsurance: (data: CreateInsuranceDto, options?: { onSuccess?: () => void }) => {
      return createInsuranceMutation.mutate(data, options)
    },
    isCreating: createInsuranceMutation.isPending,

    updateInsurance: (id: string, data: UpdateInsuranceDto, options?: { onSuccess?: () => void }) => {
      return updateInsuranceMutation.mutate({ id, data }, options)
    },
    isUpdating: updateInsuranceMutation.isPending,

    deleteInsurance: (id: string, options?: { onSuccess?: () => void }) => {
      return deleteInsuranceMutation.mutate(id, options)
    },
    isDeleting: deleteInsuranceMutation.isPending,
  }
}

export const useInsurance = (id: string) => {
  const getInsuranceQuery = useQuery({
    queryKey: INSURANCE_QUERY_KEYS.detail(id),
    queryFn: () => insurancesService.getInsurance(id),
    enabled: !!id,
  })

  return {
    insurance: getInsuranceQuery.data,
    isLoading: getInsuranceQuery.isLoading,
    isError: getInsuranceQuery.isError,
    error: getInsuranceQuery.error,
  }
}
