import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Protect ALL routes starting with /onboard
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/compliance");

  if (isProtectedRoute) {
    if (!token) {
      // No token → redirect to login
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Define which paths the middleware applies to
export const config = {
  matcher: ["/onboard/:path*"],  // protect ALL /onboard/* pages
};
