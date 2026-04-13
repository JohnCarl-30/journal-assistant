import { Sparkles } from "lucide-react";

import { GoogleSignInButton } from "@/modules/auth/components/google-sign-in-button";
import { hasSupabasePublicEnv } from "@/shared/lib/supabase/env";

export default function LoginPage() {
  const authConfigured = hasSupabasePublicEnv();

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1380px] overflow-hidden rounded-[2rem] border border-[rgba(223,231,225,0.96)] bg-white/72 shadow-paper lg:grid-cols-[1.1fr_.9fr]">
        <section className="relative flex flex-col justify-between overflow-hidden px-8 py-10 sm:px-12 sm:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(87,195,174,0.22),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.76),rgba(245,247,243,0.94))]" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--primary)] text-[var(--foreground)]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">OJT Journal</p>
              <p className="text-sm text-muted-foreground">Work journal studio</p>
            </div>
          </div>

          <div className="relative z-10 max-w-[520px] space-y-6 py-12 lg:py-0">
            <p className="eyebrow">Student sign in</p>
            <h1 className="font-heading text-6xl leading-[0.96] text-foreground sm:text-7xl">
              Keep the internship journal, weekly recap, and final report in one calm place.
            </h1>
            <p className="max-w-xl text-base leading-8 text-muted-foreground">
              Sign in with Google to log daily work, generate weekly summaries, prepare for
              supervisor evaluation, and export the final report when the term is complete.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="rounded-full border border-[var(--border)] bg-white/74 px-4 py-2">
              Daily logs
            </span>
            <span className="rounded-full border border-[var(--border)] bg-white/74 px-4 py-2">
              Weekly summaries
            </span>
            <span className="rounded-full border border-[var(--border)] bg-white/74 px-4 py-2">
              Final report export
            </span>
          </div>
        </section>

        <section className="flex items-center border-t editorial-rule bg-[rgba(245,247,243,0.66)] px-8 py-10 sm:px-12 lg:border-l lg:border-t-0">
          <div className="w-full max-w-[420px] space-y-6">
            <div className="space-y-2">
              <p className="eyebrow">Welcome back</p>
              <h2 className="text-3xl font-semibold text-foreground">Continue with Google</h2>
              <p className="text-sm leading-7 text-muted-foreground">
                This demo route is ready for Supabase Google OAuth wiring when you connect the
                real auth layer.
              </p>
            </div>

            <div className="space-y-4 rounded-[1.75rem] border border-[var(--border)] bg-white/84 p-6">
              <GoogleSignInButton />

              <p className="text-sm leading-7 text-muted-foreground">
                {authConfigured
                  ? "Google OAuth is wired for Supabase SSR auth. After sign-in, the app routes will unlock behind the authenticated session."
                  : "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to activate Google OAuth for this screen."}
              </p>

              {!authConfigured ? (
                <div className="rounded-[1.25rem] border border-dashed border-[var(--border)] bg-[rgba(245,247,243,0.75)] px-4 py-4 text-sm leading-6 text-muted-foreground">
                  The rest of the app stays protected until the Supabase public environment
                  variables are configured.
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
