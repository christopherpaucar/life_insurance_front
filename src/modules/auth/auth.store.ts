import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IAuthResponse, IUser, LoginDto, RegisterDto } from './auth.interfaces';
import { authServices } from './auth.service';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hydrated: boolean;
}

interface AuthActions {
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: RegisterDto) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hydrated: false,

      initializeAuth: () => {
        const { token, user } = get();

        if (token && user) {
          set({ isAuthenticated: true, hydrated: true });
        } else {
          set({ hydrated: true });
        }
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authServices.login(credentials.email, credentials.password);

          const { data } = response as { data: IAuthResponse };
          const { token, user } = data;

          // Map the backend permissions to frontend permissions
          if (user.roles && user.roles[0].permissions) {
            const mappedPermissions = user.roles[0].permissions;
            user.roles[0].permissions = mappedPermissions;
          }

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authServices.register(userData);
          const { data } = response as { data: IAuthResponse };
          const { token, user } = data;

          if (user.roles && user.roles[0].permissions) {
            const mappedPermissions = user.roles[0].permissions;
            user.roles[0].permissions = mappedPermissions;
          }

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initializeAuth();
        }
      },
    },
  ),
);
