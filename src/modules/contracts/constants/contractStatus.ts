import { ContractStatus } from '../contract.interfaces'

export const statusColors = {
  [ContractStatus.ACTIVE]: 'bg-green-500',
  [ContractStatus.AWAITING_CLIENT_CONFIRMATION]: 'bg-yellow-500',
  [ContractStatus.EXPIRED]: 'bg-red-500',
  [ContractStatus.CANCELLED]: 'bg-gray-500',
  [ContractStatus.DRAFT]: 'bg-gray-500',
  [ContractStatus.PENDING_BASIC_DOCUMENTS]: 'bg-blue-500',
  [ContractStatus.INACTIVE]: 'bg-gray-500',
}

export const statusLabels = {
  [ContractStatus.ACTIVE]: 'Activo',
  [ContractStatus.AWAITING_CLIENT_CONFIRMATION]: 'Pendiente de confirmación',
  [ContractStatus.EXPIRED]: 'Vencido',
  [ContractStatus.CANCELLED]: 'Cancelado',
  [ContractStatus.DRAFT]: 'Borrador',
  [ContractStatus.PENDING_BASIC_DOCUMENTS]: 'Pendiente de documentos básicos',
  [ContractStatus.INACTIVE]: 'Inactivo',
}
