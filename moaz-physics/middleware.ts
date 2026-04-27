import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1. حماية صفحات الأدمن
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // 2. حماية صفحات اليوزر
  if (pathname.startsWith("/user/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // 3. منع المسجلين من الرجوع لصفحة تسجيل الدخول
  if (pathname.startsWith("/auth") && token) {
    // التعديل هنا: هنبعته للرئيسية بدل ما نجبره يروح لليوزر داشبورد
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/dashboard/:path*", "/auth/:path*"],
};
