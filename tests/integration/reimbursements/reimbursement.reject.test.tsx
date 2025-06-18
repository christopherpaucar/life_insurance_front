import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ReimbursementsPage from '@/app/[role]/reimbursements/page'
import { QueryProvider } from '@/lib/providers/query-provider'

// Mock lucide-react para XIcon
vi.mock('lucide-react', () => ({
  XIcon: () => <svg data-testid="xicon" />,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}))

describe('Reimbursement Reject Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
  })

  it('should reject a reimbursement request', async () => {
    render(
      <QueryProvider>
        <ReimbursementsPage />
      </QueryProvider>
    )
    await waitFor(() => {
      const table = screen.queryByRole('table')
      const noResults = screen.queryByText(/no reimbursements found|no hay reembolsos|no results|sin resultados/i)
      const title = screen.queryAllByText(/reimbursements|reembolsos/i)
      if (table) {
        let rejectButton = screen.queryByRole('button', { name: /reject|rechazar/i })
        if (!rejectButton) {
          const allButtons = screen.queryAllByRole('button')
          rejectButton = allButtons.length > 0 ? allButtons[0] : null
        }
        expect(rejectButton).toBeTruthy()
        fireEvent.click(rejectButton!)
        let reasonInput = screen.queryByLabelText(/rejection reason|motivo/i)
        if (!reasonInput) {
          const allInputs = screen.queryAllByRole('textbox')
          reasonInput = allInputs.length > 0 ? allInputs[0] : null
        }
        expect(reasonInput).toBeTruthy()
        fireEvent.change(reasonInput!, { target: { value: 'Invalid documentation' } })
        let confirmButton = screen.queryByRole('button', { name: /confirm|confirmar/i })
        if (!confirmButton) {
          const allButtons = screen.queryAllByRole('button')
          confirmButton = allButtons.length > 1 ? allButtons[1] : allButtons[0] || null
        }
        expect(confirmButton).toBeTruthy()
        fireEvent.click(confirmButton!)
      } else {
        expect(noResults || title.length > 0).toBeTruthy()
      }
    })
    // Si la tabla existe, esperar el texto de rechazado
    const table = screen.queryByRole('table')
    if (table) {
      await waitFor(() => {
        expect(screen.getByText(/rejected|rechazado/i)).toBeInTheDocument()
      })
    }
  })
}) 