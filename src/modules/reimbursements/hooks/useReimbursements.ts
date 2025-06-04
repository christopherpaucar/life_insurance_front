import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reimbursementsService } from '../reimbursements.service'
import {
  IReimbursement,
  ICreateReimbursement,
  IUpdateReimbursement,
  IReviewReimbursement,
} from '../reimbursements.interfaces'
import { toast } from 'sonner'

const keys = {
  all: ['reimbursements'] as const,
  list: () => [...keys.all, 'list'] as const,
  item: (id: string) => [...keys.all, id] as const,
}

export const useReimbursements = () => {
  const queryClient = useQueryClient()

  const getReimbursementsQuery = useQuery<IReimbursement[]>({
    queryKey: keys.list(),
    queryFn: async () => {
      const { data } = await reimbursementsService.getReimbursements()
      return data
    },
  })

  const createReimbursementMutation = useMutation({
    mutationFn: (data: ICreateReimbursement) => reimbursementsService.createReimbursement(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: keys.all })
      toast.success('Reembolso creado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear el reembolso')
      console.error(error)
    },
  })

  const updateReimbursementMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateReimbursement }) =>
      reimbursementsService.updateReimbursement(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: keys.all })
      toast.success('Reembolso actualizado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar el reembolso')
      console.error(error)
    },
  })

  const reviewReimbursementMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IReviewReimbursement }) =>
      reimbursementsService.reviewReimbursement(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: keys.all })
      toast.success('Reembolso revisado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al revisar el reembolso')
      console.error(error)
    },
  })

  const deleteReimbursementMutation = useMutation({
    mutationFn: (id: string) => reimbursementsService.deleteReimbursement(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: keys.all })
      toast.success('Reembolso eliminado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al eliminar el reembolso')
      console.error(error)
    },
  })

  return {
    reimbursements: getReimbursementsQuery.data ?? [],
    isLoading: getReimbursementsQuery.isLoading,
    isError: getReimbursementsQuery.isError,
    error: getReimbursementsQuery.error,
    refetch: getReimbursementsQuery.refetch,

    createReimbursement: (data: ICreateReimbursement, options?: { onSuccess?: () => void }) => {
      return createReimbursementMutation.mutate(data, options)
    },
    isCreating: createReimbursementMutation.isPending,

    updateReimbursement: (
      id: string,
      data: IUpdateReimbursement,
      options?: { onSuccess?: () => void }
    ) => {
      return updateReimbursementMutation.mutate({ id, data }, options)
    },
    isUpdating: updateReimbursementMutation.isPending,

    reviewReimbursement: (
      id: string,
      data: IReviewReimbursement,
      options?: { onSuccess?: () => void }
    ) => {
      return reviewReimbursementMutation.mutate({ id, data }, options)
    },
    isReviewing: reviewReimbursementMutation.isPending,

    deleteReimbursement: (id: string, options?: { onSuccess?: () => void }) => {
      return deleteReimbursementMutation.mutate(id, options)
    },
    isDeleting: deleteReimbursementMutation.isPending,
  }
}

export const useReimbursement = (id: string) => {
  const getReimbursementQuery = useQuery({
    queryKey: keys.item(id),
    queryFn: async () => {
      const { data } = await reimbursementsService.getReimbursement(id)
      return data
    },
    enabled: !!id,
  })

  return {
    reimbursement: getReimbursementQuery.data,
    isLoading: getReimbursementQuery.isLoading,
    isError: getReimbursementQuery.isError,
    error: getReimbursementQuery.error,
  }
}
