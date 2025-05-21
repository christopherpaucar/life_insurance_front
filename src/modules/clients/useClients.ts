import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateClientDto, ClientQueryParams, UpdateClientDto } from './clients.interfaces';
import { clientsService } from './clients.service';
import { toast } from 'sonner';

export const CLIENT_QUERY_KEYS = {
  all: ['clients'] as const,
  list: (params?: ClientQueryParams) => [...CLIENT_QUERY_KEYS.all, 'list', params] as const,
  detail: (id: string) => [...CLIENT_QUERY_KEYS.all, 'detail', id] as const,
};

export const useClients = (params?: ClientQueryParams) => {
  const queryClient = useQueryClient();

  const getClientsQuery = useQuery({
    queryKey: CLIENT_QUERY_KEYS.list(params),
    queryFn: () => clientsService.getClients(params),
  });

  const createClientMutation = useMutation({
    mutationFn: (client: CreateClientDto) => clientsService.createClient(client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENT_QUERY_KEYS.all });
      toast.success('Cliente creado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al crear el cliente');
      console.error(error);
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientDto }) =>
      clientsService.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENT_QUERY_KEYS.all });
      toast.success('Cliente actualizado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al actualizar el cliente');
      console.error(error);
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: (id: string) => clientsService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENT_QUERY_KEYS.all });
      toast.success('Cliente eliminado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al eliminar el cliente');
      console.error(error);
    },
  });

  const linkUserAccountMutation = useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      clientsService.linkUserAccount(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENT_QUERY_KEYS.all });
      toast.success('Cuenta de usuario vinculada exitosamente');
    },
    onError: (error) => {
      toast.error('Error al vincular la cuenta de usuario');
      console.error(error);
    },
  });

  const unlinkUserAccountMutation = useMutation({
    mutationFn: (id: string) => clientsService.unlinkUserAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENT_QUERY_KEYS.all });
      toast.success('Cuenta de usuario desvinculada exitosamente');
    },
    onError: (error) => {
      toast.error('Error al desvincular la cuenta de usuario');
      console.error(error);
    },
  });

  return {
    clients: getClientsQuery.data?.data ?? [],
    meta: getClientsQuery.data?.meta,
    isLoading: getClientsQuery.isLoading,
    isError: getClientsQuery.isError,
    error: getClientsQuery.error,
    refetch: getClientsQuery.refetch,

    createClient: (data: CreateClientDto, options?: { onSuccess?: () => void }) => {
      return createClientMutation.mutate(data, options);
    },
    isCreating: createClientMutation.isPending,

    updateClient: (id: string, data: UpdateClientDto, options?: { onSuccess?: () => void }) => {
      return updateClientMutation.mutate({ id, data }, options);
    },
    isUpdating: updateClientMutation.isPending,

    deleteClient: (id: string, options?: { onSuccess?: () => void }) => {
      return deleteClientMutation.mutate(id, options);
    },
    isDeleting: deleteClientMutation.isPending,

    linkUserAccount: (id: string, userId: string, options?: { onSuccess?: () => void }) => {
      return linkUserAccountMutation.mutate({ id, userId }, options);
    },
    isLinkingUser: linkUserAccountMutation.isPending,

    unlinkUserAccount: (id: string, options?: { onSuccess?: () => void }) => {
      return unlinkUserAccountMutation.mutate(id, options);
    },
    isUnlinkingUser: unlinkUserAccountMutation.isPending,
  };
};

export const useClient = (id: string) => {
  const getClientQuery = useQuery({
    queryKey: CLIENT_QUERY_KEYS.detail(id),
    queryFn: () => clientsService.getClient(id),
    enabled: !!id,
  });

  return {
    client: getClientQuery.data,
    isLoading: getClientQuery.isLoading,
    isError: getClientQuery.isError,
    error: getClientQuery.error,
  };
};
