import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { INSURANCE_QUERY_KEYS } from './useInsurances'
import { benefitsService } from './benefits.service'
import { CreateBenefitDto, UpdateBenefitDto } from './insurances.interfaces'
import { toast } from 'sonner'

export const useBenefits = () => {
  const queryClient = useQueryClient()

  const getBenefitsQuery = useQuery({
    queryKey: INSURANCE_QUERY_KEYS.benefits(),
    queryFn: () => benefitsService.getBenefits(),
  })

  const createBenefitMutation = useMutation({
    mutationFn: (data: CreateBenefitDto) => benefitsService.createBenefit(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.benefits() })
      toast.success('Beneficio creado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear el beneficio')
      console.error(error)
    },
  })

  const updateBenefitMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBenefitDto }) =>
      benefitsService.updateBenefit(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.benefits() })
      toast.success('Beneficio actualizado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar el beneficio')
      console.error(error)
    },
  })

  const deleteBenefitMutation = useMutation({
    mutationFn: (id: string) => benefitsService.deleteBenefit(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.benefits() })
      toast.success('Beneficio eliminado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al eliminar el beneficio')
      console.error(error)
    },
  })

  return {
    benefits: getBenefitsQuery.data?.data ?? [],
    isLoading: getBenefitsQuery.isLoading,
    isError: getBenefitsQuery.isError,
    error: getBenefitsQuery.error,

    createBenefit: (data: CreateBenefitDto, options?: { onSuccess?: () => void }) => {
      return createBenefitMutation.mutate(data, options)
    },
    isCreating: createBenefitMutation.isPending,

    updateBenefit: (id: string, data: UpdateBenefitDto, options?: { onSuccess?: () => void }) => {
      return updateBenefitMutation.mutate({ id, data }, options)
    },
    isUpdating: updateBenefitMutation.isPending,

    deleteBenefit: (id: string, options?: { onSuccess?: () => void }) => {
      return deleteBenefitMutation.mutate(id, options)
    },
    isDeleting: deleteBenefitMutation.isPending,
  }
}
