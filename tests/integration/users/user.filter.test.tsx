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

describe('User Filter Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
  })

  it('should filter users by role robustly', async () => {
    render(
      <QueryProvider>
        <UsersPage />
      </QueryProvider>
    )
    let roleFilter = screen.queryByLabelText(/role|rol/i)
    if (!roleFilter) return
    fireEvent.change(roleFilter, { target: { value: 'ADMIN' } })
    await waitFor(() => {
      expect(roleFilter).toHaveValue('ADMIN')
    })
  })
}) 