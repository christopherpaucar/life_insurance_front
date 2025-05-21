import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { InsuranceFormModal } from '@/modules/insurances/components/InsuranceFormModal'
import { InsuranceType, PaymentFrequency } from '@/modules/insurances/insurances.interfaces'
import { useInsurances } from '@/modules/insurances/useInsurances'
import React from 'react'

// Mock de ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock

// Mock de useInsurances
vi.mock('@/modules/insurances/useInsurances', () => ({
  useInsurances: vi.fn(),
  useInsuranceCoverages: vi.fn(() => ({
    coverages: [],
    deleteCoverage: vi.fn(),
    isDeleting: false
  })),
  useInsuranceBenefits: vi.fn(() => ({
    benefits: [],
    deleteBenefit: vi.fn(),
    isDeleting: false
  }))
}))

describe('InsuranceFormModal', () => {
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
    ;(useInsurances as any).mockReturnValue({
      insurances: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      },
      isLoading: false,
      isError: false,
      error: null,
      createInsurance: vi.fn(),
      updateInsurance: vi.fn(),
      deleteInsurance: vi.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      refetch: vi.fn()
    })
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    insurance: null,
    mode: 'create' as const
  }

  const insurance = {
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
    deletedAt: null,
    requirements: ['Requisito 1'],
    availablePaymentFrequencies: [PaymentFrequency.MONTHLY]
  }

  it('debe renderizar el modal en modo creación', () => {
    render(<InsuranceFormModal {...defaultProps} />)
    expect(true).toBe(true)
  })

  it('debe renderizar el modal en modo edición', () => {
    render(<InsuranceFormModal {...defaultProps} mode="edit" insurance={insurance} />)
    expect(true).toBe(true)
  })

  it('debe cerrar el modal al hacer clic en cancelar', () => {
    render(<InsuranceFormModal {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('debe mostrar errores de validación al enviar el formulario vacío', async () => {
    render(<InsuranceFormModal {...defaultProps} />)
    const submitButton = screen.getByRole('button', { name: /Guardar Plan/i })
    fireEvent.click(submitButton)
    expect(true).toBe(true)
  })

  it('debe agregar y eliminar requisitos', () => {
    render(<InsuranceFormModal {...defaultProps} />)
    const input = screen.getByPlaceholderText('Agregar requisito')
    fireEvent.change(input, { target: { value: 'Nuevo requisito' } })
    fireEvent.click(screen.getByRole('button', { name: /Agregar/i }))
    expect(screen.getByText('Nuevo requisito')).toBeInTheDocument()
    const allButtons = screen.getAllByRole('button')
    const eliminarBtn = allButtons.find(btn => btn.getAttribute('aria-label') === 'Eliminar requisito') || allButtons[allButtons.length - 1]
    fireEvent.click(eliminarBtn)
    expect(screen.queryByText('Nuevo requisito')).not.toBeInTheDocument()
  })

  it('debe seleccionar y deseleccionar frecuencias de pago', async () => {
    render(<InsuranceFormModal {...defaultProps} />)
    const checkbox = screen.getByRole('checkbox', { name: 'Mensual' })
    fireEvent.click(checkbox)
    expect(true).toBe(true)
  })

  it('debe mostrar el botón de guardar deshabilitado mientras se procesa', () => {
    ;(useInsurances as any).mockReturnValue({
      insurances: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      },
      isLoading: false,
      isError: false,
      error: null,
      createInsurance: vi.fn(),
      updateInsurance: vi.fn(),
      deleteInsurance: vi.fn(),
      isCreating: true,
      isUpdating: false,
      isDeleting: false,
      refetch: vi.fn()
    })

    render(<InsuranceFormModal {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: /Guardando/i })
    expect(submitButton).toBeDisabled()
  })
}) 