export interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  documentType: string
  identificationNumber: string
  identificationDocumentUrl: string
  birthDate: string
  deletedAt: string
  userId?: string
  createdAt: string
  updatedAt: string
}

export interface CreateClientDto {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  documentType: string
  identificationNumber: string
  identificationDocumentUrl: string
  birthDate: string
}

export interface UpdateClientDto {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  documentType?: string
  documentNumber?: string
  birthDate?: string
  isActive?: boolean
}

export interface ClientQueryParams {
  page?: number
  limit?: number
  includeInactive?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ClientsState {
  clients: Client[]
  selectedClient: Client | null
  loading: boolean
  error: string | null
}
