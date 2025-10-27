import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("authjs.session-token");
  const { pathname } = request.nextUrl;

  // List of protected routes (require authentication)
  const protectedRoutes = [
    "/dashboard",
    "/transactions",
    "/wallet",
    "/support",
    "/settings",
    "/agreements",
  ];

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to sign-in if trying to access protected route without auth
  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === "/sign-in" || pathname === "/sign-up") && authToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transactions/:path*",
    "/wallet/:path*",
    "/support/:path*",
    "/settings/:path*",
    "/agreements/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
