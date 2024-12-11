// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const userType = request.cookies.get('userType');

  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Bypass untuk halaman login admin
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Redirect ke login admin jika tidak ada token
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verifikasi userType untuk admin
    if (userType?.value && !['ADMIN', 'STAFF'].includes(userType.value)) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};