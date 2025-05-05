import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { HttpClient } from "../../lib/http/http-client";
import { IAuthResponse, IUser, LoginDto, RegisterDto } from "./auth.interfaces";

const API_URL = "/auth";
const httpClient = new HttpClient();

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: RegisterDto) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await httpClient.post<{ data: IAuthResponse }>(
            `${API_URL}/login`,
            credentials
          );

          const { data } = response;
          const { token, user } = data.data;

          httpClient.setAuthToken(token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          console.log("Login successful");
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Login failed",
          });
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await httpClient.post<{ data: IAuthResponse }>(
            `${API_URL}/register`,
            userData
          );
          const { data } = response;
          const { token, user } = data.data;

          httpClient.setAuthToken(token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Registration failed",
          });
        }
      },

      logout: () => {
        httpClient.removeAuthToken();

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
