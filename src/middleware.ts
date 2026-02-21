import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 1. Specify protected and public paths
const protectedPaths = ['/dashboard', '/SAP']
const publicPaths = ['/login', '/'] 

export function middleware(request: NextRequest) {
  // 2. Check for "public only" mode
  if (process.env.PUBLIC_ONLY_MODE === 'true') {
    const path = request.nextUrl.pathname
    
    // If the request is for an API route or a protected application page, block it.
    if (path.startsWith('/api/') || protectedPaths.some(p => path.startsWith(p))) {
      // Redirect to the homepage. This is a "soft" block.
      // Alternatively, for a hard 404, you could use: return new Response('Not Found', { status: 404 })
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // 3. Continue processing the request as normal
  return NextResponse.next()
}

// 4. Configure the matcher to run the middleware on specific paths
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
