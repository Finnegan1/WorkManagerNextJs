import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export const config = {
    matcher: [
        '/intern/:path*',
        '/api/auth/change-password'
    ],
}

const adminRoutes = '/intern/admin'
const publisherRoutes = '/intern/veroeffentlichung'

export default withAuth(
    function middleware(req) {
        switch (req.nextauth.token?.user.role) {
            case 'ADMIN':
                break
            case 'PUBLISHER':
                if (req.nextUrl.pathname.startsWith(adminRoutes)) {
                    return NextResponse.redirect(new URL("/intern/", req.url))
                }
                break
            case 'USER':
                if (req.nextUrl.pathname.startsWith(adminRoutes) || req.nextUrl.pathname.startsWith(publisherRoutes)) {
                    return NextResponse.redirect(new URL("/intern/", req.url))
                }
                break
        }
        return NextResponse.next()
    },
    {
      callbacks: {
        authorized: async ({ token }) => {
            if (!token?.email) {
                return false
            }
            if (token.exp < Date.now() / 1000) {
                return false
            }
            return true
        },
      },
    },
  )
  