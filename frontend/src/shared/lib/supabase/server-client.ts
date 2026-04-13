import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";

import { getSupabasePublicEnv, hasSupabasePublicEnv } from "./env";

type CookieStoreLike = ReturnType<typeof cookies>;

function applySetAll(
  cookieStore: CookieStoreLike,
  cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>,
) {
  try {
    cookiesToSet.forEach(({ name, value, options }) => {
      cookieStore.set(name, value, options);
    });
  } catch {
    // Cookie writes can fail in contexts where the response is immutable.
  }
}

export function createRouteSupabaseClient() {
  const cookieStore = cookies();
  const { url, anonKey } = getSupabasePublicEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        applySetAll(cookieStore, cookiesToSet);
      },
    },
  });
}

export async function updateSupabaseSession(
  request: NextRequest,
): Promise<{ response: NextResponse; user: User | null }> {
  if (!hasSupabasePublicEnv()) {
    return { response: NextResponse.next({ request }), user: null };
  }

  let response = NextResponse.next({ request });
  const { url, anonKey } = getSupabasePublicEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { response, user };
}
