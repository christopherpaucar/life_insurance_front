import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

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

describe('UI Dialog Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
  })

  it('should handle dialog interactions robustly', () => {
    const mockOnOpenChange = vi.fn()
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
          <p>Dialog Content</p>
        </DialogContent>
      </Dialog>
    )
    // Verificar que el diálogo se muestra correctamente
    expect(screen.getByText(/test dialog/i)).toBeInTheDocument()
    expect(screen.getByText(/dialog content/i)).toBeInTheDocument()
    // Probar el cierre del diálogo si hay botón de cerrar
    const closeButton = screen.queryByRole('button', { name: /close|cerrar/i })
    if (closeButton) {
      fireEvent.click(closeButton)
      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    }
  })
}) 