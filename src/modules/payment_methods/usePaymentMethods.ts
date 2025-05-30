import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CreatePaymentMethodDto, QueryParams } from './payment-methods.interfaces'
import { paymentMethodsService } from './paymentMethods.service'
import { toast } from 'sonner'

export const PAYMENT_METHODS_QUERY_KEYS = {
  all: ['payment-methods'] as const,
  list: (params?: QueryParams) => [...PAYMENT_METHODS_QUERY_KEYS.all, 'list', params] as const,
  detail: (id: string) => [...PAYMENT_METHODS_QUERY_KEYS.all, 'detail', id] as const,
}

export const usePaymentMethods = (params?: QueryParams) => {
  const queryClient = useQueryClient()

  const getPaymentMethodsQuery = useQuery({
    queryKey: PAYMENT_METHODS_QUERY_KEYS.list(params),
    queryFn: () => paymentMethodsService.getPaymentMethods(params),
  })

  const createPaymentMethodMutation = useMutation({
    mutationFn: (paymentMethod: CreatePaymentMethodDto) =>
      paymentMethodsService.createPaymentMethod(paymentMethod),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEYS.all })
      toast.success('Método de pago creado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear el método de pago')
      console.error(error)
    },
  })

  const updatePaymentMethodMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePaymentMethodDto> }) =>
      paymentMethodsService.updatePaymentMethod(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEYS.all })
      toast.success('Método de pago actualizado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar el método de pago')
      console.error(error)
    },
  })

  const deletePaymentMethodMutation = useMutation({
    mutationFn: (id: string) => paymentMethodsService.deletePaymentMethod(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEYS.all })
      toast.success('Método de pago eliminado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al eliminar el método de pago')
      console.error(error)
    },
  })

  return {
    paymentMethods: getPaymentMethodsQuery.data?.data ?? [],
    meta: getPaymentMethodsQuery.data?.meta,
    isLoading: getPaymentMethodsQuery.isLoading,
    isError: getPaymentMethodsQuery.isError,
    error: getPaymentMethodsQuery.error,
    refetch: getPaymentMethodsQuery.refetch,

    createPaymentMethod: (data: CreatePaymentMethodDto, options?: { onSuccess?: () => void }) => {
      return createPaymentMethodMutation.mutate(data, options)
    },
    isCreating: createPaymentMethodMutation.isPending,

    updatePaymentMethod: (
      id: string,
      data: Partial<CreatePaymentMethodDto>,
      options?: { onSuccess?: () => void }
    ) => {
      return updatePaymentMethodMutation.mutate({ id, data }, options)
    },
    isUpdating: updatePaymentMethodMutation.isPending,

    deletePaymentMethod: (id: string, options?: { onSuccess?: () => void }) => {
      return deletePaymentMethodMutation.mutate(id, options)
    },
    isDeleting: deletePaymentMethodMutation.isPending,
  }
}

export const usePaymentMethod = (id: string) => {
  const getPaymentMethodQuery = useQuery({
    queryKey: PAYMENT_METHODS_QUERY_KEYS.detail(id),
    queryFn: () => paymentMethodsService.getPaymentMethod(id),
    enabled: !!id,
  })

  return {
    paymentMethod: getPaymentMethodQuery.data,
    isLoading: getPaymentMethodQuery.isLoading,
    isError: getPaymentMethodQuery.isError,
    error: getPaymentMethodQuery.error,
  }
}
