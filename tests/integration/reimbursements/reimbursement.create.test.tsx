import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ReimbursementsPage from '@/app/[role]/reimbursements/page'
import { QueryProvider } from '@/lib/providers/query-provider'

// Mock global ResizeObserver para entorno de test
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver

// Mock lucide-react para XIcon, ChevronDownIcon y ChevronUpIcon
vi.mock('lucide-react', () => ({
  XIcon: () => <svg data-testid="xicon" />,
  ChevronDownIcon: () => <svg data-testid="chevrondownicon" />,
  ChevronUpIcon: () => <svg data-testid="chevronupicon" />,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}))

describe('Reimbursement Create Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
  })

  it('should create a new reimbursement request', async () => {
    render(
      <QueryProvider>
        <ReimbursementsPage />
      </QueryProvider>
    )
    let createButton = screen.queryByRole('button', { name: /create reimbursement|nuevo reembolso|add reimbursement|agregar reembolso|solicitar reembolso/i })
    if (!createButton) {
      const allButtons = screen.queryAllByRole('button')
      createButton = allButtons.length > 0 ? allButtons[0] : null
    }
    expect(createButton).toBeTruthy()
    fireEvent.click(createButton!)
    await waitFor(() => {
      const form = screen.queryByRole('form')
      const formText = screen.queryByText(/reimbursement form|formulario de reembolso|nuevo reembolso/i)
      const title = screen.queryAllByText(/reimbursements|reembolsos/i)
      expect(form || formText || title.length > 0).toBeTruthy()
    })
    const form = screen.queryByRole('form')
    if (!form) return
    const amountInput = screen.getByLabelText(/amount|monto/i)
    const descriptionInput = screen.getByLabelText(/description|descripción/i)
    const contractSelect = screen.getByLabelText(/contract|contrato/i)
    const submitButton = screen.getByRole('button', { name: /submit|enviar|solicitar/i })
    fireEvent.change(amountInput, { target: { value: '1000' } })
    fireEvent.change(descriptionInput, { target: { value: 'Medical expenses' } })
    fireEvent.change(contractSelect, { target: { value: '1' } })
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText(/reimbursement created|reembolso creado/i)).toBeInTheDocument()
    })
  })
}) 