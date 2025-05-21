import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateInsuranceDto,
  CreateInsuranceCoverageDto,
  CreateInsuranceBenefitDto,
  InsuranceQueryParams,
  InsuranceType,
  PaymentFrequency,
  UpdateInsuranceDto,
  UpdateInsuranceCoverageDto,
  UpdateInsuranceBenefitDto,
} from './insurances.interfaces'
import { insurancesService } from './insurances.service'
import { toast } from 'sonner'

export const INSURANCE_QUERY_KEYS = {
  all: ['insurances'] as const,
  list: (params?: InsuranceQueryParams) => [...INSURANCE_QUERY_KEYS.all, 'list', params] as const,
  detail: (id: string) => [...INSURANCE_QUERY_KEYS.all, 'detail', id] as const,
  coverages: (insuranceId: string) => [...INSURANCE_QUERY_KEYS.detail(insuranceId), 'coverages'] as const,
  coverage: (insuranceId: string, id: string) => [...INSURANCE_QUERY_KEYS.coverages(insuranceId), id] as const,
  benefits: (insuranceId: string) => [...INSURANCE_QUERY_KEYS.detail(insuranceId), 'benefits'] as const,
  benefit: (insuranceId: string, id: string) => [...INSURANCE_QUERY_KEYS.benefits(insuranceId), id] as const,
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
      return createInsuranceMutation.mutate(
        {
          ...data,
          type: data.type.toLowerCase() as InsuranceType,
          availablePaymentFrequencies: data.availablePaymentFrequencies?.map(
            (frequency) => frequency.toLowerCase() as PaymentFrequency,
          ),
        },
        options,
      )
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
    insurance: getInsuranceQuery.data?.data,
    isLoading: getInsuranceQuery.isLoading,
    isError: getInsuranceQuery.isError,
    error: getInsuranceQuery.error,
  }
}

export const useInsuranceCoverages = (insuranceId: string) => {
  const queryClient = useQueryClient()

  const getCoveragesQuery = useQuery({
    queryKey: INSURANCE_QUERY_KEYS.coverages(insuranceId),
    queryFn: () => insurancesService.getCoverages(insuranceId),
    enabled: !!insuranceId,
  })

  const createCoverageMutation = useMutation({
    mutationFn: (data: CreateInsuranceCoverageDto) => insurancesService.createCoverage(insuranceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.coverages(insuranceId) })
      toast.success('Cobertura creada exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear la cobertura')
      console.error(error)
    },
  })

  const updateCoverageMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInsuranceCoverageDto }) =>
      insurancesService.updateCoverage(insuranceId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.coverages(insuranceId) })
      toast.success('Cobertura actualizada exitosamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar la cobertura')
      console.error(error)
    },
  })

  const deleteCoverageMutation = useMutation({
    mutationFn: (id: string) => insurancesService.deleteCoverage(insuranceId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.coverages(insuranceId) })
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

    createCoverage: (data: CreateInsuranceCoverageDto, options?: { onSuccess?: () => void }) => {
      return createCoverageMutation.mutate(data, options)
    },
    isCreating: createCoverageMutation.isPending,

    updateCoverage: (id: string, data: UpdateInsuranceCoverageDto, options?: { onSuccess?: () => void }) => {
      return updateCoverageMutation.mutate({ id, data }, options)
    },
    isUpdating: updateCoverageMutation.isPending,

    deleteCoverage: (id: string, options?: { onSuccess?: () => void }) => {
      return deleteCoverageMutation.mutate(id, options)
    },
    isDeleting: deleteCoverageMutation.isPending,
  }
}

export const useInsuranceBenefits = (insuranceId: string) => {
  const queryClient = useQueryClient()

  const getBenefitsQuery = useQuery({
    queryKey: INSURANCE_QUERY_KEYS.benefits(insuranceId),
    queryFn: () => insurancesService.getBenefits(insuranceId),
    enabled: !!insuranceId,
  })

  const createBenefitMutation = useMutation({
    mutationFn: (data: CreateInsuranceBenefitDto) => insurancesService.createBenefit(insuranceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.benefits(insuranceId) })
      toast.success('Beneficio creado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear el beneficio')
      console.error(error)
    },
  })

  const updateBenefitMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInsuranceBenefitDto }) =>
      insurancesService.updateBenefit(insuranceId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.benefits(insuranceId) })
      toast.success('Beneficio actualizado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar el beneficio')
      console.error(error)
    },
  })

  const deleteBenefitMutation = useMutation({
    mutationFn: (id: string) => insurancesService.deleteBenefit(insuranceId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.benefits(insuranceId) })
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

    createBenefit: (data: CreateInsuranceBenefitDto, options?: { onSuccess?: () => void }) => {
      return createBenefitMutation.mutate(data, options)
    },
    isCreating: createBenefitMutation.isPending,

    updateBenefit: (id: string, data: UpdateInsuranceBenefitDto, options?: { onSuccess?: () => void }) => {
      return updateBenefitMutation.mutate({ id, data }, options)
    },
    isUpdating: updateBenefitMutation.isPending,

    deleteBenefit: (id: string, options?: { onSuccess?: () => void }) => {
      return deleteBenefitMutation.mutate(id, options)
    },
    isDeleting: deleteBenefitMutation.isPending,
  }
}
