import { NextResponse } from "next/server";

import { DASHBOARD_ROUTE } from "@/shared/lib/routes";
import { hasSupabasePublicEnv } from "@/shared/lib/supabase/env";
import { createRouteSupabaseClient } from "@/shared/lib/supabase/server-client";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const nextPath = requestUrl.searchParams.get("next") || DASHBOARD_ROUTE;

  if (!hasSupabasePublicEnv()) {
    return NextResponse.redirect(new URL(LOGIN_ROUTE_WITH_REASON(nextPath), requestUrl.origin));
  }

  const code = requestUrl.searchParams.get("code");
  if (code) {
    const supabase = createRouteSupabaseClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
}

function LOGIN_ROUTE_WITH_REASON(nextPath: string) {
  return `/login?next=${encodeURIComponent(nextPath)}&reason=missing-config`;
}
