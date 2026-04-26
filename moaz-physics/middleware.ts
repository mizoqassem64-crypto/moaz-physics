import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Protect user dashboard
  if (pathname.startsWith("/user/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Redirect authenticated users from auth pages
  if (pathname.startsWith("/auth") && token) {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/dashboard/:path*", "/auth/:path*"],
};