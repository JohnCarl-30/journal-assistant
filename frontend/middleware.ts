import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { DASHBOARD_ROUTE, LOGIN_ROUTE } from "@/shared/lib/routes";
import { hasSupabasePublicEnv } from "@/shared/lib/supabase/env";
import { updateSupabaseSession } from "@/shared/lib/supabase/server-client";

const protectedPrefixes = [
  "/dashboard",
  "/journal",
  "/weeks",
  "/report",
  "/evaluation-prep",
];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedPath = isProtectedPath(pathname);

  if (!hasSupabasePublicEnv()) {
    if (protectedPath) {
      return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
    }
    return NextResponse.next();
  }

  const { response, user } = await updateSupabaseSession(request);

  if (!user && protectedPath) {
    return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
  }

  if (user && pathname === LOGIN_ROUTE) {
    return NextResponse.redirect(new URL(DASHBOARD_ROUTE, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/journal/:path*",
    "/weeks/:path*",
    "/report/:path*",
    "/evaluation-prep/:path*",
    "/login",
  ],
};
