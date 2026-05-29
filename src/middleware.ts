import {
  NextResponse,
} from "next/server"

import type {
  NextRequest,
} from "next/server"

export function middleware(
  request: NextRequest
) {
  const token =
    request.cookies.get(
      "token"
    )?.value

  const role =
    request.cookies.get(
      "role"
    )?.value

  const pathname =
    request.nextUrl.pathname

  const isAdminRoute =
    pathname.startsWith(
      "/admin"
    )

  const isDashboardRoute =
    pathname.startsWith(
      "/dashboard"
    )

  // Tidak ada token → redirect ke login
  if (
    (isAdminRoute ||
      isDashboardRoute) &&
    !token
  ) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    )
  }

  // Ada token tapi bukan ADMIN → redirect ke home
  if (
    isAdminRoute &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(
      new URL(
        "/",
        request.url
      )
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
  ],
}