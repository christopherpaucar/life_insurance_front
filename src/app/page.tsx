'use client'

import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">Seguros Sur</h1>
      <p className="text-xl mb-8">Bienvenido a nuestro sitio web</p>
      <div className="flex gap-4">
        <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Iniciar sesión
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Registrarse
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Dashboard (Privado)
        </Link>
      </div>
    </div>
  )
}
