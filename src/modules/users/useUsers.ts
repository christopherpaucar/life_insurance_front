import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ClientQueryParams, UpdateClientDto } from '@/modules/users/users.interfaces'
import { usersService } from '@/modules/users/users.service'
import { toast } from 'sonner'
import { RegisterDto, RoleType } from '../auth/auth.interfaces'
import { useAuthStore } from '../auth/auth.store'

export const USER_QUERY_KEYS = {
  all: ['users'] as const,
  list: (params?: ClientQueryParams) => [...USER_QUERY_KEYS.all, 'list', params] as const,
  detail: (id: string) => [...USER_QUERY_KEYS.all, 'detail', id] as const,
}

export const useUsers = (params?: ClientQueryParams) => {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const getUsersQuery = useQuery({
    queryKey: USER_QUERY_KEYS.list(params),
    queryFn: () => usersService.getUsers(params),
    enabled: user?.role?.name !== RoleType.CLIENT,
  })

  const createUserMutation = useMutation({
    mutationFn: (user: RegisterDto) => usersService.createUser(user),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all })
      toast.success('Usuario creado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear el usuario')
      console.error(error)
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientDto }) =>
      usersService.updateUser(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all })
      toast.success('Usuario actualizado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar el usuario')
      console.error(error)
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all })
      toast.success('Usuario eliminado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al eliminar el usuario')
      console.error(error)
    },
  })

  return {
    users: getUsersQuery.data?.data ?? [],
    meta: getUsersQuery.data?.meta,
    isLoading: getUsersQuery.isLoading,
    isError: getUsersQuery.isError,
    error: getUsersQuery.error,
    refetch: getUsersQuery.refetch,

    createUser: (data: RegisterDto, options?: { onSuccess?: () => void }) => {
      return createUserMutation.mutate(data, options)
    },
    isCreating: createUserMutation.isPending,

    updateUser: (id: string, data: UpdateClientDto, options?: { onSuccess?: () => void }) => {
      return updateUserMutation.mutate({ id, data }, options)
    },
    isUpdating: updateUserMutation.isPending,

    deleteUser: (id: string, options?: { onSuccess?: () => void }) => {
      return deleteUserMutation.mutate(id, options)
    },
    isDeleting: deleteUserMutation.isPending,
  }
}

export const useUser = (id: string) => {
  const getUserQuery = useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => usersService.getUser(id),
    enabled: !!id,
  })

  return {
    user: getUserQuery.data,
    isLoading: getUserQuery.isLoading,
    isError: getUserQuery.isError,
    error: getUserQuery.error,
  }
}
