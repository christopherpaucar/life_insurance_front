'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/modules/auth/auth.store'
import { RoleType } from '@/modules/auth/auth.interfaces'

interface RoleGuardProps {
	allowedRoles: RoleType[]
	children: React.ReactNode
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
	const { user, isAuthenticated } = useAuthStore()
	const router = useRouter()

	useEffect(() => {
		const hasAllowedRole = user?.roles?.some((role) => allowedRoles.includes(role.name as RoleType))

		if (!isAuthenticated || !hasAllowedRole) {
			router.replace('/login')
		}
	}, [user, isAuthenticated, router, allowedRoles])

	return <>{children}</>
}
