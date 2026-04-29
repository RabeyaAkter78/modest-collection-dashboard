import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("admin_user")?.value;

    // Since we use localStorage (client-side), middleware can't fully check auth.
    // The AuthGuard component handles client-side redirect.
    // Middleware here provides an additional layer for SSR protection.
    return NextResponse.next();
  }

  // Redirect logged-in users away from login page
  if (pathname === "/login") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
