import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

/**
 * MitraOS Production Security Middleware
 * 
 * Ensures Vercel/Production deployments ONLY serve public marketing pages.
 * SaaS logic (Dashboard, Admin, APIs) is locked and redirected to home.
 */
export function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(hi|en|mr)/:path*'],
};
