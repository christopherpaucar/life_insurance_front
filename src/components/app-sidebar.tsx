'use client'

import * as React from 'react'
import { IconInnerShadowTop } from '@tabler/icons-react'

import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { useAuthService } from '../modules/auth/useAuth'
import { useRouter } from 'next/navigation'
import {
  adminNavItems,
  agentNavItems,
  clientNavItems,
  reviewerNavItems,
  secondaryNavItems,
} from './nav-data'
import { RoleType } from '@/modules/auth/auth.interfaces'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { logout, user } = useAuthService()
  const router = useRouter()

  const handleLogout = () => {
    logout(void 0, {
      onSuccess: () => {
        router.push('/login')
      },
    })
  }

  const getNavigationItems = () => {
    if (!user) return []

    const roleName = user.role?.name as RoleType

    if (roleName === RoleType.SUPER_ADMIN || roleName === RoleType.ADMIN) {
      return adminNavItems
    }

    if (roleName === RoleType.AGENT) {
      return agentNavItems
    }

    if (roleName === RoleType.CLIENT) {
      return clientNavItems
    }

    if (roleName === RoleType.REVIEWER) {
      return reviewerNavItems
    }

    return []
  }

  const navItems = getNavigationItems()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Seguros Sur</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavSecondary items={secondaryNavItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} logout={handleLogout} />
      </SidebarFooter>
    </Sidebar>
  )
}
