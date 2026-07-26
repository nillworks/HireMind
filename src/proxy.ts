import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth';

const AUTH_PATHS = ['/login', '/regester'] as const;
const PROTECTED_PATHS = [
  '/jobs/',
  '/plans',
  '/blog',
  '/dashboard',
  '/profile',
  '/saved-jobs',
] as const;

function isProtected(pathname: string) {
  return PROTECTED_PATHS.some(
    p =>
      pathname === p ||
      pathname.startsWith(p + '/') ||
      (p.endsWith('/') && pathname.startsWith(p)),
  );
}

function isAuthPage(pathname: string) {
  return AUTH_PATHS.some(p => pathname.startsWith(p));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const session = await auth().api.getSession({
      headers: request.headers,
    });

    if (session && isAuthPage(pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (!session && isProtected(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch {
    if (isProtected(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/regester',
    '/jobs/:path*',
    '/plans',
    '/blog',
    '/blog/:path*',
    '/dashboard/:path*',
    '/profile',
    '/saved-jobs',
  ],
};
