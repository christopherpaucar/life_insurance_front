import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPublicRoute } from "./config/routes.config";

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname;

  // Check if the current route is public using our configuration
  const isCurrentRoutePublic = isPublicRoute(pathname);

  // Since middleware runs on the server, we can't access localStorage directly
  // We need to check the token from cookies instead
  const token = request.cookies.get("token")?.value;

  // Allow access to public routes regardless of authentication
  if (isCurrentRoutePublic) {
    return NextResponse.next();
  }

  // If it's a private route and user is not authenticated, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    // Add the original URL as a parameter to redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated, allow access to private route
  return NextResponse.next();
}

export const config = {
  // Apply this middleware to all routes except API routes, static files and error pages
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
