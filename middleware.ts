import { getServerSession } from "next-auth/next"
import { authOptions } from "./pages/api/auth/[...nextauth]"
import { NextRequest, NextResponse } from "next/server"
import { redirect } from "next/navigation"

export const config = {
    matcher: '/internal/:path*',
}

export { default } from "next-auth/middleware"