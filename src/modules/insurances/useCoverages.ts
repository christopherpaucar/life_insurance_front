import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'

import { coverageService } from './coverage.service'
import { INSURANCE_QUERY_KEYS } from './useInsurances'
import { toast } from 'sonner'
import { CreateCoverageDto, UpdateCoverageDto } from './dtos/insurance.dtos'

export const useCoverages = () => {
  const queryClient = useQueryClient()

  const getCoveragesQuery = useQuery({
    queryKey: INSURANCE_QUERY_KEYS.coverages(),
    queryFn: () => coverageService.getCoverages(),
  })

  const createCoverageMutation = useMutation({
    mutationFn: (data: CreateCoverageDto) => coverageService.createCoverage(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.coverages() })
      toast.success('Cobertura creada exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear la cobertura')
      console.error(error)
    },
  })

  const updateCoverageMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCoverageDto }) =>
      coverageService.updateCoverage(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.coverages() })
      toast.success('Cobertura actualizada exitosamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar la cobertura')
      console.error(error)
    },
  })

  const deleteCoverageMutation = useMutation({
    mutationFn: (id: string) => coverageService.deleteCoverage(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.coverages() })
      toast.success('Cobertura eliminada exitosamente')
    },
    onError: (error) => {
      toast.error('Error al eliminar la cobertura')
      console.error(error)
    },
  })

  return {
    coverages: getCoveragesQuery.data?.data ?? [],
    isLoading: getCoveragesQuery.isLoading,
    isError: getCoveragesQuery.isError,
    error: getCoveragesQuery.error,

    createCoverage: (data: CreateCoverageDto, options?: { onSuccess?: () => void }) => {
      return createCoverageMutation.mutate(data, options)
    },
    isCreating: createCoverageMutation.isPending,

    updateCoverage: (id: string, data: UpdateCoverageDto, options?: { onSuccess?: () => void }) => {
      return updateCoverageMutation.mutate({ id, data }, options)
    },
    isUpdating: updateCoverageMutation.isPending,

    deleteCoverage: (id: string, options?: { onSuccess?: () => void }) => {
      return deleteCoverageMutation.mutate(id, options)
    },
    isDeleting: deleteCoverageMutation.isPending,
  }
}
