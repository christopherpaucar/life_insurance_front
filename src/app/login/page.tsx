'use client'

import { LoginForm } from "@/modules/auth/components/login-form"
import { usePublicRoute } from "../../hooks/usePublicRoute";

export default function LoginPage() {
  usePublicRoute();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}
