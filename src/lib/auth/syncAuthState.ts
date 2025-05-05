import { useEffect } from "react";
import { useAuthStore } from "../../modules/auth/auth.store";

/**
 * Syncs the authentication state between localStorage and cookies
 * This is necessary because Next.js middleware can only access cookies, not localStorage
 */
export const useSyncAuthState = () => {
  const { token } = useAuthStore();

  useEffect(() => {
    // When token changes in auth store (from localStorage)
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

  // Check localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !getCookie("token")) {
      document.cookie = `token=${storedToken}; max-age=${
        60 * 60 * 24 * 7
      }; path=/; samesite=strict`;
    }
  }, []);
};

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};
