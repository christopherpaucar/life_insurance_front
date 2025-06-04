'use client'

import { IconUser } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useCallback } from 'react'

const TRADUCTIONS = {
  dashboard: 'Dashboard',
  profile: 'Mi Perfil',
  reimbursements: 'Reembolsos',
  insurances: 'Seguros',
  reports: 'Reportes',
}

export function SiteHeader() {
  const pathname = usePathname()

  const getPageTitle = useCallback(() => {
    if (!pathname) return 'Dashboard'

    const segments = pathname.split('/')
    const lastSegment = segments[segments.length - 1]

    if (lastSegment === 'dashboard') return 'Dashboard'
    if (lastSegment === 'profile') return 'Mi Perfil'

    return lastSegment.split('-').join(' ')
  }, [pathname])

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">
          {TRADUCTIONS[getPageTitle() as keyof typeof TRADUCTIONS] || 'Dashboard'}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="flex gap-2">
            <Link href="/profile">
              <IconUser size={16} />
              <span className="hidden sm:inline">Perfil</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
