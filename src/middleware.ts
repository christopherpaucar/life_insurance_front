import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isPublicRoute } from './config/routes.config'

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname

  // Check if the current route is public using our configuration
  const isCurrentRoutePublic = isPublicRoute(pathname)

  // Get auth token from cookies
  const token = request.cookies.get('token')?.value

  // Allow access to public routes regardless of authentication
  console.log('isCurrentRoutePublic', isCurrentRoutePublic)
  if (isCurrentRoutePublic) {
    // If user is authenticated and trying to access login or register pages
    if (token && (pathname === '/login' || pathname === '/register')) {
      // Redirect to dashboard instead - client-side routing will handle specific role redirection
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // If it's a private route and user is not authenticated, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // User is authenticated, allow access to private route
  // Role-based access control will be handled by the client-side RouteGuard
  return NextResponse.next()
}

export const config = {
  // Apply this middleware to all routes except API routes, static files and error pages
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
