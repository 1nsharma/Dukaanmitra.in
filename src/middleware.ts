
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * DukaanMitra Routing Guard
 * Vercel -> Public Marketing Only
 * Firebase/Local -> Full App
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  
  // Is this the public-facing Vercel deployment?
  const isPublicFrontend = host.includes('vercel.app') || host === 'dukaanmitra.in' || host === 'www.dukaanmitra.in';
  
  const protectedPaths = ['/dashboard', '/SAP', '/admin', '/api/verify-payment', '/api/create-order'];
  const isProtected = protectedPaths.some(path => url.pathname.startsWith(path));

  if (isPublicFrontend && isProtected) {
    // Force redirect Vercel users to homepage if they try to access internal app routes
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
