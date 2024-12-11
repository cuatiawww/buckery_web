// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const userType = request.cookies.get('userType');

  // Jika mengakses halaman admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Jika bukan halaman login admin dan tidak ada token
    if (!request.nextUrl.pathname.includes('/admin/login') && !token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Jika ada token tapi bukan ADMIN atau STAFF
    if (token && userType?.value && !['ADMIN', 'STAFF'].includes(userType.value)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};