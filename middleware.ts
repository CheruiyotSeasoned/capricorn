import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // If no token, and not already on /auth
  if (!token && !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',               // 👈 Protect root "/"
    '/dashboard/:path*', 
    '/loans/:path*',    // Add any other private pages
    '/profile/:path*'
  ],
};
