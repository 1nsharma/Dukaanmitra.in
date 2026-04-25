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
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  
  // Production host identifiers (Hardened)
  const isProductionFrontend = 
    host.includes('vercel.app') || 
    host === 'dukaanmitra.in' || 
    host === 'www.dukaanmitra.in' ||
    host === 'mitraos.in';
  
  // Restricted SaaS/Admin/API paths
  const protectedPaths = [
    '/dashboard', 
    '/SAP', 
    '/admin', 
    '/login', 
    '/api/verify-payment', 
    '/api/create-order', 
    '/api/whatsapp',
    '/api/cron'
  ];
  
  // Strip locale prefix if present for path check
  const pathname = url.pathname;
  const pathnameWithoutLocale = routing.locales.some(locale => pathname.startsWith(`/${locale}/`))
    ? pathname.replace(/^\/[^\/]+/, '')
    : pathname;

  const isProtected = protectedPaths.some(path => pathnameWithoutLocale.startsWith(path));

  if (isProductionFrontend && isProtected) {
    // Force redirect to homepage for any SaaS or Admin routes on Vercel deployments
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Handle i18n
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(hi|en|mr)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
