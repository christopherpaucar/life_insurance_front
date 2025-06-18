import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

describe('UI Layout Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'fake-token')
  })

  it('should render DashboardLayout robustly', () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    )
    expect(screen.getByText(/test content/i)).toBeInTheDocument()
  })
}) 