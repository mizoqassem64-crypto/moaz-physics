import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // مؤقتاً هنوقف الفحص الصارم عشان تقدر تدخل لوحة التحكم
  // لأن التوكن متسيف في الـ localStorage والـ Middleware مش بيقدر يشوفه من هنا
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/dashboard/:path*", "/auth/:path*"],
};
