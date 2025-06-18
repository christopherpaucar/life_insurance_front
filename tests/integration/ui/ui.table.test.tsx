import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DataTable } from '@/components/data-table'

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
  // Agrega más íconos si aparecen otros errores
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}))

describe('UI Table Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
  })

  it('should handle data table interactions robustly', async () => {
    const mockData = [
      { id: 1, header: 'John Doe', type: 'user', status: 'active', target: '100', limit: '50', reviewer: 'Admin' },
      { id: 2, header: 'Jane Smith', type: 'user', status: 'inactive', target: '200', limit: '100', reviewer: 'Admin' }
    ]
    render(<DataTable data={mockData} />)
    // Verificar que la tabla existe
    const table = screen.queryByRole('table')
    expect(table).toBeInTheDocument()
    // Verificar que la tabla muestra los datos correctamente (si existen)
    if (mockData.length > 0) {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument()
      expect(screen.getByText(/jane smith/i)).toBeInTheDocument()
    }
    // Probar la ordenación si hay botón de header
    const headerButton = screen.queryByRole('button', { name: /header|encabezado/i })
    if (headerButton) {
      fireEvent.click(headerButton)
      await waitFor(() => {
        const rows = screen.getAllByRole('row')
        expect(rows[1].textContent?.toLowerCase()).toContain('jane smith')
      })
    }
    // Probar la búsqueda si hay input de búsqueda
    const searchInput = screen.queryByRole('searchbox')
    if (searchInput) {
      fireEvent.change(searchInput, { target: { value: 'John' } })
      await waitFor(() => {
        expect(screen.getByText(/john doe/i)).toBeInTheDocument()
        expect(screen.queryByText(/jane smith/i)).not.toBeInTheDocument()
      })
    }
  })
}) 