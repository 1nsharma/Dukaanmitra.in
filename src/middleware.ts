import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * STRICT PUBLIC MODE: 
 * Set this to 'true' to disable all app functionality (Dashboard, Login, APIs)
 * and only show the marketing site.
 */
const PUBLIC_ONLY_MODE = 'true';

const protectedPaths = ['/dashboard', '/SAP', '/login', '/api']

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (PUBLIC_ONLY_MODE === 'true') {
    // If trying to access any protected or functional path, redirect to home
    if (protectedPaths.some(p => path.startsWith(p))) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
