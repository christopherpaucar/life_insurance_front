import { useMutation } from '@tanstack/react-query'
import { IOnboarding, LoginDto, RegisterDto } from './auth.interfaces'
import { useAuthStore } from './auth.store'
import { toast } from 'sonner'

export const useAuthService = () => {
  const { login, register, logout, clearError, user, completeOnboarding, updateOnboarding } =
    useAuthStore()

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginDto) => login(credentials),
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success('Inicio de sesión exitoso')
      console.log('data', data)
      return data
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

  const updateOnboardingMutation = useMutation({
    mutationFn: (data: Partial<IOnboarding>) => updateOnboarding(data),
    onSuccess: () => {
      toast.success('Información actualizada exitosamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar la información')
      console.error(error)
    },
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

    updateOnboarding: updateOnboardingMutation.mutate,
    isUpdatingOnboarding: updateOnboardingMutation.isPending,

    clearError,
    hasPermission,
    user,
  }
}
