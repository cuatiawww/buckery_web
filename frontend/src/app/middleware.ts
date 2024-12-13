import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userType = request.cookies.get('userType')?.value;

  // Debug log
  console.log('Middleware check:', { path: request.nextUrl.pathname, token, userType });

  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Izinkan akses ke halaman login admin
    if (request.nextUrl.pathname === '/admin/login') {
      // Jika sudah login sebagai admin, redirect ke dashboard
      if (token && ['ADMIN', 'STAFF'].includes(userType || '')) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    // Cek autentikasi untuk halaman admin lainnya
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Cek otorisasi
    if (!userType || !['ADMIN', 'STAFF'].includes(userType)) {
      // Clear invalid auth
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('token');
      response.cookies.delete('userType');
      response.cookies.delete('username');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};