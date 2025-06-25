'use client'

import React from 'react'
import { AuthenticatedLayout } from '../../components/layouts/AuthenticatedLayout'

interface PageProps {
  params: Promise<{
    id: string
    role: string
  }>
  children: React.ReactNode
}

// @ts-ignore
export default function RoleLayout({ children, params }) {
  return <>{children}</>
}
