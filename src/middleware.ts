
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

/**
 * DukaanMitra Production Security Middleware
 * 
 * This middleware ensures that Vercel deployments ONLY serve the public marketing pages.
 * Any attempt to access the Dashboard, Admin Panels, or SaaS APIs on Vercel 
 * is redirected to the homepage.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  
  // Identify if the request is coming from Vercel or the production domain
  const isProductionFrontend = 
    host.includes('vercel.app') || 
    host === 'dukaanmitra.in' || 
    host === 'www.dukaanmitra.in';
  
  // Paths that are restricted on the public production frontend
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
  // Apply middleware to all routes except static assets and images
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
