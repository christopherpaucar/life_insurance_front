import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Contract, ContractStatus } from '../contract.interfaces'
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

export enum AttachmentType {
  IDENTIFICATION = 'identification',
  MEDICAL_RECORD = 'medical_record',
  MEDICAL_EXAM = 'medical_exam',
  CONTRACT = 'contract',
  REIMBURSEMENT = 'reimbursement',
  INVOICE = 'invoice',
  OTHER = 'other',
}

export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
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
      const response = await api.post<ApiResponse<void>>(
        `/contracts/${contractId}/attachments`,
        file,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    },
    onSuccess: (_, { contractId }) => {
      void queryClient.invalidateQueries({ queryKey: ['contracts', contractId] })
    },
  })

  const activateContractByClientMutation = useMutation<
    ApiResponse<Contract>,
    Error,
    {
      contractId: string
      paymentMethodType: PaymentMethodType
      paymentDetails: Record<string, any>
      p12File: File
    }
  >({
    mutationFn: async ({ contractId, paymentMethodType, paymentDetails, p12File }) => {
      const formData = new FormData()
      formData.append('paymentMethodType', paymentMethodType)
      formData.append('paymentDetails', JSON.stringify(paymentDetails))
      formData.append('p12File', p12File)

      const response = await api.post<ApiResponse<Contract>>(
        `/contracts/${contractId}/confirm-activation`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
  })

  const activateContractByAgentMutation = useMutation<
    ApiResponse<Contract>,
    Error,
    { contractId: string }
  >({
    mutationFn: async ({ contractId }) => {
      const response = await api.post<ApiResponse<Contract>>(`/contracts/${contractId}/activate`)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['contracts'] })
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

    activateContractByAgent: (params: { contractId: string }) =>
      activateContractByAgentMutation.mutate(params, {
        onSuccess: () => {
          toast.success('Contrato activado exitosamente')
        },
        onError: () => {
          toast.error('Error al activar el contrato')
        },
      }),
    isActivating: activateContractByAgentMutation.isPending,

    activateContractByClient: (params: {
      contractId: string
      paymentMethodType: PaymentMethodType
      paymentDetails: Record<string, any>
      p12File: File
    }) =>
      activateContractByClientMutation.mutate(params, {
        onSuccess: () => {
          toast.success('Contrato confirmado exitosamente')
        },
        onError: () => {
          toast.error('Error al confirmar el contrato')
        },
      }),
    isActivatingByClient: activateContractByClientMutation.isPending,
  }
}
