import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === "ADMIN"
    const isEmployee = token?.role === "EMPLOYEE"
    const { pathname } = req.nextUrl

    // If user is not authenticated, redirect to signin
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    // Admin routes protection
    if (pathname.startsWith("/admin")) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // Employee routes protection
    if (pathname.startsWith("/dashboard")) {
      if (!isAdmin && !isEmployee) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"]
}