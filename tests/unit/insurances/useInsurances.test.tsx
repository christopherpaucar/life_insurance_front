import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useInsurances } from '../../../src/modules/insurances/useInsurances'
import { insurancesService } from '../../../src/modules/insurances/insurances.service'
import { InsuranceType, PaymentFrequency } from '../../../src/modules/insurances/insurances.interfaces'
import React from 'react'

// Mock del servicio de seguros
vi.mock('@/modules/insurances/insurances.service', () => ({
  insurancesService: {
    getInsurances: vi.fn(),
    createInsurance: vi.fn(),
    updateInsurance: vi.fn(),
    deleteInsurance: vi.fn()
  }
}))

// Mock de toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('useInsurances', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    })
    vi.clearAllMocks()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  describe('getInsurances', () => {
    it('debe obtener la lista de seguros', async () => {
      const mockInsurances = {
        data: [
          {
            id: '1',
            name: 'Seguro de Vida',
            description: 'Seguro de vida básico',
            type: InsuranceType.LIFE,
            basePrice: 100,
            rank: 1,
            duration: 12,
            isActive: true,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
            coverages: [],
            benefits: [],
            deletedAt: null
          }
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      }

      ;(insurancesService.getInsurances as any).mockResolvedValue(mockInsurances)

      const { result } = renderHook(() => useInsurances(), { wrapper })

      // Esperar a que se resuelva la consulta
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      // Esperar a que el estado se actualice
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(result.current.insurances).toEqual(mockInsurances.data)
      expect(result.current.meta).toEqual(mockInsurances.meta)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isError).toBe(false)
    })

    it('debe manejar errores al obtener seguros', async () => {
      const error = new Error('Error al obtener seguros')
      ;(insurancesService.getInsurances as any).mockRejectedValue(error)

      const { result } = renderHook(() => useInsurances(), { wrapper })

      // Esperar a que se resuelva la consulta
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      // Esperar a que el estado de carga cambie
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(result.current.insurances).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isError).toBe(true)
      expect(result.current.error).toBeDefined()
    })
  })

  describe('createInsurance', () => {
    it('debe crear un nuevo seguro', async () => {
      const newInsurance = {
        name: 'Seguro de Vida',
        description: 'Seguro de vida básico',
        type: InsuranceType.LIFE,
        basePrice: 100,
        rank: 1,
        duration: 12,
        availablePaymentFrequencies: [PaymentFrequency.MONTHLY]
      }

      const mockResponse = {
        data: {
          id: '1',
          ...newInsurance,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          coverages: [],
          benefits: [],
          deletedAt: null
        }
      }

      ;(insurancesService.createInsurance as any).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useInsurances(), { wrapper })

      await act(async () => {
        await result.current.createInsurance(newInsurance)
      })

      expect(insurancesService.createInsurance).toHaveBeenCalledWith({
        ...newInsurance,
        type: newInsurance.type.toLowerCase(),
        availablePaymentFrequencies: newInsurance.availablePaymentFrequencies?.map(f => f.toLowerCase())
      })
      expect(result.current.isCreating).toBe(false)
    })

    it('debe manejar errores al crear un seguro', async () => {
      const newInsurance = {
        name: 'Seguro de Vida',
        description: 'Seguro de vida básico',
        type: InsuranceType.LIFE,
        basePrice: 100,
        rank: 1,
        duration: 12,
        availablePaymentFrequencies: [PaymentFrequency.MONTHLY]
      }

      const error = new Error('Error al crear seguro')
      ;(insurancesService.createInsurance as any).mockRejectedValue(error)

      const { result } = renderHook(() => useInsurances(), { wrapper })

      await act(async () => {
        await result.current.createInsurance(newInsurance)
      })

      expect(insurancesService.createInsurance).toHaveBeenCalledWith({
        ...newInsurance,
        type: newInsurance.type.toLowerCase(),
        availablePaymentFrequencies: newInsurance.availablePaymentFrequencies?.map(f => f.toLowerCase())
      })
      expect(result.current.isCreating).toBe(false)
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
          id: '1',
          ...updateData,
          description: 'Seguro de vida básico',
          type: InsuranceType.LIFE,
          rank: 1,
          duration: 12,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          coverages: [],
          benefits: [],
          deletedAt: null
        }
      }

      ;(insurancesService.updateInsurance as any).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useInsurances(), { wrapper })

      await act(async () => {
        await result.current.updateInsurance('1', updateData)
      })

      expect(insurancesService.updateInsurance).toHaveBeenCalledWith('1', updateData)
      expect(result.current.isUpdating).toBe(false)
    })

    it('debe manejar errores al actualizar un seguro', async () => {
      const updateData = {
        name: 'Seguro de Vida Premium',
        basePrice: 150
      }

      const error = new Error('Error al actualizar seguro')
      ;(insurancesService.updateInsurance as any).mockRejectedValue(error)

      const { result } = renderHook(() => useInsurances(), { wrapper })

      await act(async () => {
        await result.current.updateInsurance('1', updateData)
      })

      expect(insurancesService.updateInsurance).toHaveBeenCalledWith('1', updateData)
      expect(result.current.isUpdating).toBe(false)
    })
  })

  describe('deleteInsurance', () => {
    it('debe eliminar un seguro', async () => {
      ;(insurancesService.deleteInsurance as any).mockResolvedValue({ data: null })

      const { result } = renderHook(() => useInsurances(), { wrapper })

      await act(async () => {
        await result.current.deleteInsurance('1')
      })

      expect(insurancesService.deleteInsurance).toHaveBeenCalledWith('1')
      expect(result.current.isDeleting).toBe(false)
    })

    it('debe manejar errores al eliminar un seguro', async () => {
      const error = new Error('Error al eliminar seguro')
      ;(insurancesService.deleteInsurance as any).mockRejectedValue(error)

      const { result } = renderHook(() => useInsurances(), { wrapper })

      await act(async () => {
        await result.current.deleteInsurance('1')
      })

      expect(insurancesService.deleteInsurance).toHaveBeenCalledWith('1')
      expect(result.current.isDeleting).toBe(false)
    })
  })
}) 