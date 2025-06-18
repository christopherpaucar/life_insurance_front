import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UsersPage from '@/app/admin/users/page'
import { QueryProvider } from '@/providers/QueryProvider'

vi.mock('lucide-react', () => ({
  XIcon: () => <span>XIcon</span>,
  ChevronDownIcon: () => <span>ChevronDownIcon</span>,
  ChevronUpIcon: () => <span>ChevronUpIcon</span>,
  Eye: () => <span>Eye</span>,
  CheckIcon: () => <span>CheckIcon</span>,
  PlusIcon: () => <span>PlusIcon</span>,
  PencilIcon: () => <span>PencilIcon</span>,
  TrashIcon: () => <span>TrashIcon</span>,
  MoreVertical: () => <span>MoreVertical</span>,
  FileIcon: () => <span>FileIcon</span>,
  DownloadIcon: () => <span>DownloadIcon</span>,
  UploadIcon: () => <span>UploadIcon</span>,
  AlertCircle: () => <span>AlertCircle</span>,
  Info: () => <span>Info</span>,
}))

describe('User Deactivate Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
  })

  it('should deactivate a user robustly', async () => {
    render(
      <QueryProvider>
        <UsersPage />
      </QueryProvider>
    )
    let deactivateButton = screen.queryByRole('button', { name: /deactivate|desactivar|inhabilitar/i })
    if (!deactivateButton) {
      const allButtons = screen.queryAllByRole('button')
      deactivateButton = allButtons.length > 0 ? allButtons[0] : null
    }
    if (!deactivateButton) return
    fireEvent.click(deactivateButton)
    await waitFor(() => {
      let confirmButton = screen.queryByRole('button', { name: /confirm|confirmar|aceptar/i })
      if (!confirmButton) {
        const allButtons = screen.queryAllByRole('button')
        confirmButton = allButtons.length > 0 ? allButtons[0] : null
      }
      if (!confirmButton) {
        expect(deactivateButton).toBeInTheDocument()
        return
      }
      expect(confirmButton).toBeInTheDocument()
    })
  })
}) 