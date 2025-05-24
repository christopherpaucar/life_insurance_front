import { useMutation } from '@tanstack/react-query'
import { IOnboarding, LoginDto, RegisterDto } from './auth.interfaces'
import { useAuthStore } from './auth.store'
import { toast } from 'sonner'

export const useAuthService = () => {
  const { login, register, logout, clearError, user, completeOnboarding } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginDto) => login(credentials),
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('Inicio de sesión exitoso')
    },
  })

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterDto) => register(userData),
    onError: (error) => {
      toast.error(error.message || 'Error en registro')
    },
    onSuccess: () => {
      toast.success('Registro exitoso')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => {
      logout()
      return Promise.resolve()
    },
  })

  const hasPermission = (): boolean => {
    if (!user) return false

    return true
  }

  const completeOnboardingMutation = useMutation({
    mutationFn: (data: IOnboarding) => completeOnboarding(data),
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {},
  })

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,

    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    completeOnboarding: completeOnboardingMutation.mutate,
    isCompletingOnboarding: completeOnboardingMutation.isPending,

    clearError,
    hasPermission,
    user,
  }
}
