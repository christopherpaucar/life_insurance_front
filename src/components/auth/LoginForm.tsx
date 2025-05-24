import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoginDto } from '@/modules/auth/auth.interfaces'

interface LoginFormProps {
  onSubmit?: (data: LoginDto) => void
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>()

  return (
    <form onSubmit={handleSubmit(onSubmit || (() => {}))}>
      <div className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            {...register('email', { required: 'El email es requerido' })}
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <Input
            type="password"
            placeholder="Contraseña"
            {...register('password', { required: 'La contraseña es requerida' })}
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        <Button type="submit">Iniciar Sesión</Button>
      </div>
    </form>
  )
}
