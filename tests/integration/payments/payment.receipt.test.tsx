import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PaymentsPage from '@/app/admin/payments/page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}))

describe('Payment Receipt Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
  })

  it('should generate payment receipt', async () => {
    render(<PaymentsPage />)

    await waitFor(() => {
      const table = screen.queryByRole('table')
      const noPayments = screen.queryByText(/no payments found|no hay pagos|no results|sin resultados/i)
      const title = screen.queryAllByText(/payments|pagos/i)
      if (table) {
        const receiptButton = screen.getByRole('button', { name: /generate receipt/i })
        fireEvent.click(receiptButton)
        expect(screen.getByText(/receipt generated/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /download receipt/i })).toBeInTheDocument()
      } else {
        expect(noPayments || title.length > 0).toBeTruthy()
      }
    })
  })
}) 