import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the path
  const path = request.nextUrl.pathname;

  // Check if it's an admin route
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // Get the token from localStorage
    const token = request.cookies.get('token')?.value;
    const userType = request.cookies.get('userType')?.value;

    // If no token or not admin, redirect to login
    if (!token || userType !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};