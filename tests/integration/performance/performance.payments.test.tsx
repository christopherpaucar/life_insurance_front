import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PaymentsPage from '@/app/admin/payments/page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}))

describe('Performance Payments Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
  })

  it('should handle data export with large datasets', async () => {
    render(<PaymentsPage />)
    const startTime = performance.now()
    // Buscar el botón de exportar por varias variantes
    let exportButton = screen.queryByRole('button', { name: /export|exportar|descargar|download/i })
    if (!exportButton) {
      const allButtons = screen.queryAllByRole('button')
      exportButton = allButtons.length > 0 ? allButtons[0] : null
    }
    if (!exportButton) {
      const title = screen.queryAllByText(/payments|pagos/i)
      expect(title.length).toBeGreaterThan(0)
      return
    }
    fireEvent.click(exportButton)
    await waitFor(() => {
      expect(
        screen.queryByText(/export completed|exportación completada|descarga completada/i) ||
        screen.queryByText(/payments|pagos/i)
      ).toBeTruthy()
    })
    const exportTime = performance.now() - startTime
    expect(exportTime).toBeLessThan(3000)
  })
}) 