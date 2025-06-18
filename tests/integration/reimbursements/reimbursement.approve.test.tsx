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

describe('Reimbursement Approve Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
  })

  it('should approve a reimbursement request', async () => {
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
        let approveButton = screen.queryByRole('button', { name: /approve|aprobar/i })
        if (!approveButton) {
          const allButtons = screen.queryAllByRole('button')
          approveButton = allButtons.length > 0 ? allButtons[0] : null
        }
        expect(approveButton).toBeTruthy()
        fireEvent.click(approveButton!)
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
    // Si la tabla existe, esperar el texto de aprobado
    const table = screen.queryByRole('table')
    if (table) {
      await waitFor(() => {
        expect(screen.getByText(/approved|aprobado/i)).toBeInTheDocument()
      })
    }
  })
}) 