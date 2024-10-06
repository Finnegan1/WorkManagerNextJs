import { withAuth } from "next-auth/middleware"
import prisma from "./lib/prisma"

export const config = {
    matcher: [
        '/intern/:path*',
        '/api/auth/change-password'
    ],
}



export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    function middleware(req) {
        console.log("middleware")
        console.log(req.nextauth.token)
    },
    {
      callbacks: {
        authorized: async ({ token }) => {
            console.log(process.env.NEXTAUTH_SECRET)
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
  