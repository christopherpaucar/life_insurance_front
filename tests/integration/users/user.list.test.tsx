import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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

describe('User List Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
  })

  it('should display user list robustly', async () => {
    render(
      <QueryProvider>
        <UsersPage />
      </QueryProvider>
    )
    await waitFor(() => {
      const table = screen.queryByRole('table')
      expect(table).toBeInTheDocument()
    })
  })
}) 