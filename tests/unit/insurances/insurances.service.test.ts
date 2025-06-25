import { describe, it, expect, vi, beforeEach } from 'vitest'
import { insurancesService } from '@/modules/insurances/insurances.service'
import { getHttpClient } from '@/lib/http'
import { InsuranceType } from '@/modules/insurances/enums/insurance.enums'

// Mock del cliente HTTP
vi.mock('@/lib/http', () => ({
  getHttpClient: vi.fn()
}))

describe('insurancesService', () => {
  const mockHttpClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(getHttpClient as any).mockResolvedValue(mockHttpClient)
    
    // Configurar respuestas por defecto
    mockHttpClient.get.mockResolvedValue({ data: { data: [], meta: {} } })
    mockHttpClient.post.mockResolvedValue({ data: { data: {} } })
    mockHttpClient.put.mockResolvedValue({ data: { data: {} } })
    mockHttpClient.delete.mockResolvedValue({ data: { data: null } })
  })

  describe('getInsurances', () => {
    it('debe obtener la lista de seguros', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: '1',
              name: 'Seguro de Vida',
              description: 'Seguro de vida básico',
              type: InsuranceType.LIFE,
              basePrice: 100,
              order: 1,
              prices: [],
              requirements: [],
              coverages: [],
              benefits: [],
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01',
              deletedAt: null,
              availablePaymentFrequencies: []
            }
          ],
          meta: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1
          }
        }
      }

      mockHttpClient.get.mockResolvedValue(mockResponse)

      const result = await insurancesService.getInsurances()

      expect(mockHttpClient.get).toHaveBeenCalledWith('/insurances', { params: undefined })
      expect(result).toEqual(mockResponse.data)
    })

    it('debe obtener la lista de seguros con parámetros', async () => {
      const params = { page: 1, limit: 10 }
      const mockResponse = {
        data: {
          data: [],
          meta: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          }
        }
      }

      mockHttpClient.get.mockResolvedValue(mockResponse)

      const result = await insurancesService.getInsurances(params)

      expect(mockHttpClient.get).toHaveBeenCalledWith('/insurances', { params })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getInsurance', () => {
    it('debe obtener un seguro por su ID', async () => {
      const mockResponse = {
        data: {
          data: {
            id: '1',
            name: 'Seguro de Vida',
            description: 'Seguro de vida básico',
            type: InsuranceType.LIFE,
            basePrice: 100,
            order: 1,
            prices: [],
            requirements: [],
            coverages: [],
            benefits: [],
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
            deletedAt: null,
            availablePaymentFrequencies: []
          }
        }
      }

      mockHttpClient.get.mockResolvedValue(mockResponse)

      const result = await insurancesService.getInsurance('1')

      expect(mockHttpClient.get).toHaveBeenCalledWith('/insurances/1')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('createInsurance', () => {
    it('debe crear un nuevo seguro', async () => {
      const newInsurance = {
        name: 'Seguro de Vida',
        description: 'Seguro de vida básico',
        type: InsuranceType.LIFE,
        basePrice: 100,
        order: 1
      }

      const mockResponse = {
        data: {
          data: {
            id: '1',
            ...newInsurance,
            prices: [],
            requirements: [],
            coverages: [],
            benefits: [],
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
            deletedAt: null,
            availablePaymentFrequencies: []
          }
        }
      }

      mockHttpClient.post.mockResolvedValue(mockResponse)

      const result = await insurancesService.createInsurance(newInsurance)

      expect(mockHttpClient.post).toHaveBeenCalledWith('/insurances', newInsurance)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('updateInsurance', () => {
    it('debe actualizar un seguro existente', async () => {
      const updateData = {
        name: 'Seguro de Vida Premium',
        basePrice: 150
      }

      const mockResponse = {
        data: {
          data: {
            id: '1',
            name: 'Seguro de Vida Premium',
            description: 'Seguro de vida básico',
            type: InsuranceType.LIFE,
            basePrice: 150,
            order: 1,
            prices: [],
            requirements: [],
            coverages: [],
            benefits: [],
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
            deletedAt: null,
            availablePaymentFrequencies: []
          }
        }
      }

      mockHttpClient.put.mockResolvedValue(mockResponse)

      const result = await insurancesService.updateInsurance('1', updateData)

      expect(mockHttpClient.put).toHaveBeenCalledWith('/insurances/1', updateData)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('deleteInsurance', () => {
    it('debe eliminar un seguro', async () => {
      const mockResponse = {
        data: {
          data: null
        }
      }

      mockHttpClient.delete.mockResolvedValue(mockResponse)

      const result = await insurancesService.deleteInsurance('1')

      expect(mockHttpClient.delete).toHaveBeenCalledWith('/insurances/1')
      expect(result).toEqual(mockResponse.data)
    })
  })
})