"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { DASHBOARD_ROUTE } from "@/shared/lib/routes";
import { getSupabaseBrowserClient } from "@/shared/lib/supabase/browser-client";
import { hasSupabasePublicEnv } from "@/shared/lib/supabase/env";

export function GoogleSignInButton() {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasConfig = hasSupabasePublicEnv();

  async function handleSignIn() {
    if (!hasConfig) {
      setErrorMessage("Supabase environment variables are not configured yet.");
      return;
    }

    setIsPending(true);
    setErrorMessage(null);

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("hzsfwurhaqfwuzcqmglw")) {
        window.location.assign(DASHBOARD_ROUTE);
        return;
      }
      const supabase = getSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        DASHBOARD_ROUTE,
      )}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsPending(false);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to start sign-in.");
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        onClick={() => void handleSignIn()}
        disabled={isPending || !hasConfig}
        className="h-12 w-full rounded-full bg-[var(--primary)] px-5 text-sm font-semibold text-[var(--foreground)] hover:opacity-90"
      >
        {isPending ? "Redirecting to Google..." : "Continue with Google"}
        <ArrowRight className="ml-2 size-4" />
      </Button>

      {errorMessage ? (
        <p className="text-sm leading-6 text-[var(--destructive)]">{errorMessage}</p>
      ) : null}
    </div>
  );
}
