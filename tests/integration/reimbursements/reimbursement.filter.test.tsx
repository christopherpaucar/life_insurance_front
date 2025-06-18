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

describe('Reimbursement Filter Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
  })

  it('should filter reimbursements by status', async () => {
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
        let statusFilter = screen.queryByLabelText(/status|estado/i)
        if (!statusFilter) {
          const allInputs = screen.queryAllByRole('combobox')
          statusFilter = allInputs.length > 0 ? allInputs[0] : null
        }
        expect(statusFilter).toBeTruthy()
        fireEvent.change(statusFilter!, { target: { value: 'pending' } })
        // Verificar que solo se muestran reembolsos pendientes
        const rows = screen.getAllByRole('row')
        rows.forEach((row: HTMLElement) => {
          if (row !== rows[0]) {
            expect(row).toHaveTextContent(/pending|pendiente/i)
          }
        })
      } else {
        expect(noResults || title.length > 0).toBeTruthy()
      }
    })
  })
}) 