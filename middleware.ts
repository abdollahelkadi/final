import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''

  // Check if the request is for the admin subdomain
  if (hostname === 'admin.flexifeeds.me') {
    // Rewrite to the admin page
    url.pathname = '/admin'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - favicon.png (favicon file)
     * - favicon.ico?v=2 (cache-busted favicon)
     * - apple-touch-icon.png (Apple touch icon)
     * - site.webmanifest (Web App Manifest)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|favicon.png|favicon.ico\\?v=2|apple-touch-icon.png|site.webmanifest).*)',
  ],
}
