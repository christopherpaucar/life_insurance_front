import { useMutation } from '@tanstack/react-query'
import { LoginDto, RegisterDto, Permission } from './auth.interfaces'
import { useAuthStore } from './auth.store'
import { toast } from 'sonner'

export const useAuthService = () => {
  const { login, register, logout, clearError, user } = useAuthStore()

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

  const hasPermission = (permission: Permission | Permission[]): boolean => {
    if (!user) return false

    const userPermissions = user.roles[0].permissions || []

    if (Array.isArray(permission)) {
      return permission.some((p) => userPermissions.includes(p))
    }

    return userPermissions.includes(permission)
  }

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,

    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    clearError,
    hasPermission,
    user,
  }
}
