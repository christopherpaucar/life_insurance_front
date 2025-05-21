import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Contract, ContractStatus } from '../types'
import { getHttpClient } from '../../../lib/http'
import { ApiResponse } from '../../insurances/insurances.interfaces'
import { toast } from 'sonner'

const api = getHttpClient()

interface UpdateContractData {
  status?: ContractStatus
  notes?: string
}

interface UpdateContractParams {
  id: string
  data: UpdateContractData
}

interface UploadAttachmentParams {
  contractId: string
  file: FormData
}

interface SignContractParams {
  contractId: string
}

export enum AttachmentType {
  IDENTIFICATION = 'identification',
  MEDICAL_RECORD = 'medical_record',
  MEDICAL_EXAM = 'medical_exam',
  CONTRACT = 'contract',
  REIMBURSEMENT = 'reimbursement',
  INVOICE = 'invoice',
  OTHER = 'other',
}

export function useContract(id?: string) {
  const queryClient = useQueryClient()

  const getContractQuery = useQuery<Contract>({
    queryKey: ['contracts', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Contract>>(`/contracts/${id}`)
      return data.data
    },
    enabled: !!id,
  })

  const getContractsQuery = useQuery<Contract[]>({
    queryKey: ['contracts'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Contract[]>>('/contracts')
      return data.data
    },
  })

  const updateContractMutation = useMutation<ApiResponse<Contract>, Error, UpdateContractParams>({
    mutationFn: async ({ id, data }) => {
      const response = await api.put<ApiResponse<Contract>>(`/contracts/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
  })

  const uploadAttachmentMutation = useMutation<ApiResponse<void>, Error, UploadAttachmentParams>({
    mutationFn: async ({ contractId, file }) => {
      const response = await api.post<ApiResponse<void>>(`/contracts/${contractId}/attachments`, file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: (_, { contractId }) => {
      void queryClient.invalidateQueries({ queryKey: ['contracts', contractId] })
    },
  })

  const signContractMutation = useMutation<ApiResponse<void>, Error, SignContractParams>({
    mutationFn: async ({ contractId }) => {
      const response = await api.post<ApiResponse<void>>(`/contracts/${contractId}/sign`)
      return response.data
    },
    onSuccess: (_, { contractId }) => {
      void queryClient.invalidateQueries({ queryKey: ['contracts', contractId] })
    },
  })

  const createContractMutation = useMutation<ApiResponse<Contract>, Error>({
    mutationFn: async (data) => {
      const response = await api.post<ApiResponse<Contract>>('/contracts', data)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
  })

  return {
    contract: getContractQuery.data,
    contracts: getContractsQuery.data,
    isLoading: getContractQuery.isLoading || getContractsQuery.isLoading,
    isError: getContractQuery.isError || getContractsQuery.isError,
    error: getContractQuery.error || getContractsQuery.error,

    createContract: (data: any) =>
      createContractMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Estado del contrato actualizado')
        },
        onError: () => {
          toast.error('Error al actualizar el estado del contrato')
        },
      }),
    isCreating: createContractMutation.isPending,

    updateContract: (params: UpdateContractParams) =>
      updateContractMutation.mutate(params, {
        onSuccess: () => {
          toast.success('Estado del contrato actualizado')
        },
        onError: () => {
          toast.error('Error al actualizar el estado del contrato')
        },
      }),
    isUpdating: updateContractMutation.isPending,

    uploadAttachment: (params: UploadAttachmentParams) =>
      uploadAttachmentMutation.mutate(params, {
        onSuccess: () => {
          toast.success('Archivo subido exitosamente')
        },
        onError: () => {
          toast.error('Error al subir el archivo')
        },
      }),
    isUploading: uploadAttachmentMutation.isPending,

    signContract: (params: SignContractParams) =>
      signContractMutation.mutate(params, {
        onSuccess: () => {
          toast.success('Contrato firmado exitosamente')
        },
        onError: () => {
          toast.error('Error al firmar el contrato')
        },
      }),
    isSigning: signContractMutation.isPending,
  }
}
