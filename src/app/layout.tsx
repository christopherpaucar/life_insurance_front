import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../components/auth/AuthProvider'
import { RouteManager } from '../components/auth/RouteManager'
import { QueryProvider } from '../providers/QueryProvider'
import { Toaster } from '../components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Seguros Sur',
  description: 'Seguros para tu vida',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <RouteManager>{children}</RouteManager>
          </AuthProvider>
        </QueryProvider>
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  )
}
