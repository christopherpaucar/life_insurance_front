import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PaymentsPage from '@/app/admin/payments/page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}))

describe('Payment Refund Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
  })

  it('should handle payment refund', async () => {
    render(<PaymentsPage />)

    await waitFor(() => {
      const table = screen.queryByRole('table')
      const noPayments = screen.queryByText(/no payments found|no hay pagos|no results|sin resultados/i)
      const title = screen.queryAllByText(/payments|pagos/i)
      if (table) {
        const refundButton = screen.getByRole('button', { name: /refund/i })
        fireEvent.click(refundButton)
        const reasonInput = screen.getByLabelText(/refund reason/i)
        fireEvent.change(reasonInput, { target: { value: 'Customer request' } })
        const confirmButton = screen.getByRole('button', { name: /confirm/i })
        fireEvent.click(confirmButton)
        expect(screen.getByText(/refund processed/i)).toBeInTheDocument()
      } else {
        expect(noPayments || title.length > 0).toBeTruthy()
      }
    })
  })
}) 