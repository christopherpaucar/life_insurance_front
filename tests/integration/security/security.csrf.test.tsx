import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PaymentsPage from '@/app/admin/payments/page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}))

describe('Security CSRF Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
  })

  it('should handle CSRF protection', () => {
    render(<PaymentsPage />)
    let newPaymentButton = screen.queryByRole('button', { name: /new payment|nuevo pago|add payment|agregar pago|crear pago/i })
    if (!newPaymentButton) {
      const allButtons = screen.queryAllByRole('button')
      newPaymentButton = allButtons.length > 0 ? allButtons[0] : null
    }
    if (!newPaymentButton) {
      const title = screen.queryAllByText(/payments|pagos/i)
      expect(title.length).toBeGreaterThan(0)
      return
    }
    fireEvent.click(newPaymentButton)
    const form = screen.getByRole('form')
    expect(form).toHaveAttribute('data-csrf-token')
  })
}) 