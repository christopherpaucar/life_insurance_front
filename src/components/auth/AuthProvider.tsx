'use client';

import { useEffect } from "react";
import { useAuthStore } from "../../modules/auth/auth.store";
import { useSyncAuthState } from "../../lib/auth/syncAuthState";

interface AuthProviderProps {
	children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const { token } = useAuthStore();

	// Use the syncAuthState hook to keep localStorage and cookies in sync
	useSyncAuthState();

	// Initialize auth state from localStorage on client side
	useEffect(() => {
		const storedToken = localStorage.getItem("token");

		// If there's a token in localStorage but not in the store, initialize it
		if (storedToken && !token) {
			// We could initialize the auth store here if needed
			// For now, syncAuthState handles the cookie part
		}
	}, [token]);

	return <>{children}</>;
} 