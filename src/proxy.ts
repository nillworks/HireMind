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

  let session: Record<string, unknown> | null = null;
  let sessionError = false;
  try {
    session = await auth().api.getSession({
      headers: request.headers,
    });
  } catch (e) {
    console.error('[proxy] session check failed:', e);
    sessionError = true;
  }

  if (session && isAuthPage(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If session check itself failed (transient error), allow access instead of
  // redirecting — the client-side session hook will handle auth state.
  if (!session && isProtected(pathname) && !sessionError) {
    return NextResponse.redirect(new URL('/login', request.url));
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
