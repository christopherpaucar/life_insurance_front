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
import { useAuthService } from '../modules/auth/auth.service'
import { useRouter } from 'next/navigation'
import { adminNavItems, agentNavItems, clientNavItems, secondaryNavItems } from './nav-data'
import { Permission, RoleType } from '@/modules/auth/auth.interfaces'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { logout, user, hasPermission } = useAuthService()
  const router = useRouter()

  const handleLogout = () => {
    logout(void 0, {
      onSuccess: () => {
        router.push('/login')
      },
    })
  }

  // Determine which navigation items to show based on user role
  const getNavigationItems = () => {
    if (!user) return []

    // Map role name to corresponding navigation items
    const roleName = user.roles[0].name as RoleType

    // Check permissions for each role type
    if (roleName === RoleType.SUPER_ADMIN || roleName === RoleType.ADMIN) {
      return adminNavItems.filter((item) => !item.permissions || hasPermission(item.permissions))
    } else if (roleName === RoleType.AGENT) {
      return agentNavItems.filter((item) => !item.permissions || hasPermission(item.permissions))
    } else if (roleName === RoleType.CLIENT) {
      return clientNavItems.filter((item) => !item.permissions || hasPermission(item.permissions))
    } else if (roleName === RoleType.REVIEWER) {
      // Revisor role might have similar access as agent but more limited
      return agentNavItems
        .filter((item) => item.permissions?.includes(Permission.REVIEW_REIMBURSEMENTS))
        .filter((item) => !item.permissions || hasPermission(item.permissions))
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
