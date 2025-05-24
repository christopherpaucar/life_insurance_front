'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { NavItem } from '@/modules/auth/auth.interfaces'

interface NavSecondaryProps extends React.ComponentProps<typeof SidebarMenu> {
  items: NavItem[]
}

export function NavSecondary({ className, items, ...props }: NavSecondaryProps) {
  return (
    <SidebarMenu className={cn('border-sidebar-border p-2', className)} {...props}>
      {items?.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link href={item.url}>
              {item.icon && <item.icon className="mr-2 size-4" />}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
