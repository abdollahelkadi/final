import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || ""
  const url = request.nextUrl

  const mainDomain = "flexifeeds.me"
  const adminDomain = "admin.flexifeeds.me"

  // Scenario 1: Request from admin.flexifeeds.me
  if (hostname === adminDomain) {
    // If accessing root path on admin domain, rewrite to /admin
    if (url.pathname === "/") {
      return NextResponse.rewrite(new URL("/admin", request.url))
    }
    // For any other path on admin domain (e.g., /admin/articles), allow it to proceed.
    // The /admin page itself will handle further authorization based on host.
    return NextResponse.next()
  }

  // Scenario 2: Request from flexifeeds.me
  if (hostname === mainDomain) {
    // If accessing /admin or any path under /admin from the main domain, return 404
    if (url.pathname.startsWith("/admin")) {
      return new NextResponse(null, { status: 404 }) // Return 404 Not Found
    }
    // For any other path on main domain, allow it to proceed normally
    return NextResponse.next()
  }

  // Default case: for any other unexpected host, just proceed
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
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
