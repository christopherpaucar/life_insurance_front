import { create } from "zustand";
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

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await httpClient.post<IAuthResponse>(
        `${API_URL}/login`,
        credentials
      );
      const { user, token } = response.data;

      httpClient.setAuthToken(token);
      localStorage.setItem("token", token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await httpClient.post<IAuthResponse>(
        `${API_URL}/register`,
        userData
      );
      const { user, token } = response.data;

      httpClient.setAuthToken(token);
      localStorage.setItem("token", token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Registration failed",
      });
    }
  },

  logout: () => {
    httpClient.removeAuthToken();
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  clearError: () => set({ error: null }),
}));
