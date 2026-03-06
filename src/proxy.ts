import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('admin_session');
  const { pathname } = request.nextUrl;

  // 1. Define your paths
  const isLoginPage = pathname === '/admin/login';
  const isAdminRoute = pathname.startsWith('/admin');

  // 2. If trying to access any /admin page without a session, send to login
  if (isAdminRoute && !isLoginPage && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // 3. If already logged in and trying to go to login page, send to dashboard
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

// Ensure this matcher covers all your admin subfolders
export const config = {
  matcher: ['/admin/:path*'],
};