'use client';

import { useCallback, useEffect } from 'react';
import { useRouteConfig } from '../../hooks/useRouteConfig';
import { useAuthStore } from '../../modules/auth/auth.store';

interface RouteManagerProps {
	children?: React.ReactNode;
}

export function RouteManager({ children }: RouteManagerProps) {
	const { setRouteAsPrivate } = useRouteConfig();
	const { user } = useAuthStore();

	// Update routes based on user role
	useEffect(() => {
		if (user?.role) {
			updateRoutesForRole(user.role);
		}
	}, [user]);

	// Configure routes based on user role
	const updateRoutesForRole = useCallback((role: string) => {
		if (role === 'admin') {
			// Make admin routes accessible
			setRouteAsPrivate('/admin');
			setRouteAsPrivate('/admin/users');
			setRouteAsPrivate('/admin/settings');
		} else if (role === 'user') {
			// Make user routes accessible, but restrict admin routes
			setRouteAsPrivate('/user/profile');
			setRouteAsPrivate('/user/settings');
		}
	}, [setRouteAsPrivate]);

	return (
		<>
			{/* Optionally render children if needed */}
			{children}
		</>
	);
} 