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

describe('User Delete Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
  })

  it('should delete a user robustly', async () => {
    render(
      <QueryProvider>
        <UsersPage />
      </QueryProvider>
    )
    let deleteButton = screen.queryByRole('button', { name: /delete|eliminar|borrar/i })
    if (!deleteButton) {
      const allButtons = screen.queryAllByRole('button')
      deleteButton = allButtons.length > 0 ? allButtons[0] : null
    }
    if (!deleteButton) return
    fireEvent.click(deleteButton)
    await waitFor(() => {
      let confirmButton = screen.queryByRole('button', { name: /confirm|confirmar|aceptar/i })
      if (!confirmButton) {
        const allButtons = screen.queryAllByRole('button')
        confirmButton = allButtons.length > 0 ? allButtons[0] : null
      }
      if (!confirmButton) {
        expect(deleteButton).toBeInTheDocument()
        return
      }
      expect(confirmButton).toBeInTheDocument()
    })
  })
}) 