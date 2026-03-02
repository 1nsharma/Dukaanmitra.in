import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * MitraOS Production Security Middleware
 * 
 * Ensures Vercel/Production deployments ONLY serve public marketing pages.
 * SaaS logic (Dashboard, Admin, APIs) is locked and redirected to home.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  
  // Production host identifiers
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
  
  const isProtected = protectedPaths.some(path => url.pathname.startsWith(path));

  if (isProductionFrontend && isProtected) {
    // Force redirect to homepage for any SaaS or Admin routes on Vercel
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
