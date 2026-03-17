import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const PROTECTED_ROUTES = ['/admin', '/hr', '/team-lead', '/candidate']

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if the current path is a protected route
    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        pathname.startsWith(route)
    )

    if (!isProtectedRoute) {
        return NextResponse.next()
    }

    // Check for the session cookie set by auth-store on login
    const sessionCookie = request.cookies.get('hs_user_id')

    if (!sessionCookie || !sessionCookie.value) {
        // No session cookie — redirect to login
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/(admin|hr|team-lead|candidate)/:path*',
    ],
}
