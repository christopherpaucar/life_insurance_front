import { useEffect } from "react";
import { useAuthStore } from "../../modules/auth/auth.store";

/**
 * Syncs the authentication state between store and cookies
 * This is necessary because Next.js middleware can only access cookies, not the store
 */
export const useSyncAuthState = () => {
  const { token } = useAuthStore();

  useEffect(() => {
    // When token changes in auth store (which is persisted by Zustand)
    if (token) {
      // Set in cookies for middleware
      document.cookie = `token=${token}; max-age=${
        60 * 60 * 24 * 7
      }; path=/; samesite=strict`;
    } else {
      // Remove from cookies when logged out
      document.cookie = "token=; max-age=0; path=/";
    }
  }, [token]);
};
