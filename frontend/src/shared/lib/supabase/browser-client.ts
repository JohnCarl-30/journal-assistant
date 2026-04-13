import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabasePublicEnv, hasSupabasePublicEnv } from "./env";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient() {
  if (!hasSupabasePublicEnv()) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  if (!browserClient) {
    const { url, anonKey } = getSupabasePublicEnv();
    browserClient = createBrowserClient(url, anonKey);
  }

  return browserClient;
}
