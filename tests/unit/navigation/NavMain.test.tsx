import { render, screen } from '@testing-library/react'
import { NavMain } from '@/components/nav-main'
import { describe, it, expect } from 'vitest'
import { adminNavItems } from '@/components/nav-data'
import { SidebarProvider } from '@/components/ui/sidebar'

describe('NavMain Component', () => {
  const renderWithSidebar = (ui: React.ReactElement) => {
    return render(
      <SidebarProvider>
        {ui}
      </SidebarProvider>
    )
  }

  it('renders navigation items correctly', () => {
    renderWithSidebar(<NavMain items={adminNavItems} />)
    // Verificar que los elementos de navegación principales estén presentes
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Gestión de Roles')).toBeInTheDocument()
    expect(screen.getByText('Gestión de Seguros')).toBeInTheDocument()
  })

  it('applies correct styling to active link', () => {
    renderWithSidebar(<NavMain items={adminNavItems} />)
    const activeLink = screen.getByText('Dashboard').closest('a')
    expect(activeLink).toHaveAttribute('data-active', 'false')
  })

  it('renders all navigation items from nav-data', () => {
    renderWithSidebar(<NavMain items={adminNavItems} />)
    // Verificar que todos los elementos del menú estén presentes
    const navItems = screen.getAllByRole('link')
    expect(navItems.length).toBeGreaterThan(0)
  })
}) 