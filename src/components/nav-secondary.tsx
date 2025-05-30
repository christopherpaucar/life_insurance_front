'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { NavItem, RoleType } from '@/modules/auth/auth.interfaces'
import { useCallback, useMemo } from 'react'
import { RoutingService } from '../lib/routing/routingService'
import { useAuthStore } from '@/modules/auth/auth.store'

interface NavSecondaryProps extends React.ComponentProps<typeof SidebarMenu> {
  items: NavItem[]
}

export function NavSecondary({ className, items, ...props }: NavSecondaryProps) {
  const routingService = useMemo(() => new RoutingService(), [])
  const { user, isAuthenticated, hydrated } = useAuthStore()
  const userRole = useMemo(() => {
    return user?.role?.name as RoleType | undefined
  }, [user?.role])

  const canAccessCurrentRoute = useCallback(
    (url: string) => {
      if (!hydrated || !isAuthenticated) return false

      return routingService.canUserAccessRoute(url, userRole as RoleType)
    },
    [hydrated, isAuthenticated, userRole, routingService]
  )

  return (
    <SidebarMenu className={cn('border-sidebar-border p-2', className)} {...props}>
      {items?.map(
        (item) =>
          canAccessCurrentRoute(item.url) && (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  {item.icon && <item.icon className="mr-2 size-4" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
      )}
    </SidebarMenu>
  )
}
