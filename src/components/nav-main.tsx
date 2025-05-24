'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { NavItem } from '@/modules/auth/auth.interfaces'

interface NavMainProps extends React.ComponentProps<typeof SidebarMenu> {
  items: NavItem[]
  title?: string
}

export function NavMain({ className, items, title = 'Main Navigation', ...props }: NavMainProps) {
  return (
    <SidebarMenu className={cn('px-3 py-2 data-[collapsed=true]:py-2', className)} {...props}>
      {title && (
        <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">{title}</div>
      )}
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
