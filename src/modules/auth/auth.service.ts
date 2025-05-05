import { useMutation } from "@tanstack/react-query";
import { LoginDto, RegisterDto } from "./auth.interfaces";
import { useAuthStore } from "./auth.store";
import { toast } from "sonner";

export const useAuthService = () => {
  const { login, register, logout, clearError } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginDto) => login(credentials),
    onError: (error) => {
      toast.error(error.message);
      console.error("Login error:", error);
    },
    onSuccess: () => {
      toast.success("Inicio de sesión exitoso from lenin");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterDto) => register(userData),
    onError: (error) => {
      toast.error("Error en registro");
      console.error("Registration error:", error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => {
      logout();
      return Promise.resolve();
    },
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,

    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    clearError,
  };
};
