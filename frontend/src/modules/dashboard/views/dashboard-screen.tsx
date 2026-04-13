"use client";

import Link from "next/link";
import { ArrowUpRight, FileText, NotebookPen } from "lucide-react";

import { useDashboardViewModel } from "@/modules/dashboard/view-models/use-dashboard-view-model";
import { MockShot } from "@/shared/components/data-display/mock-shot";
import { ProgressRing } from "@/shared/components/data-display/progress-ring";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { TODAY_LOG_ROUTE, WEEKLY_ROUTE } from "@/shared/lib/routes";

import { DashboardLoading } from "./dashboard-loading";

export function DashboardScreen() {
  const { dashboard, isLoading, isError, retry } = useDashboardViewModel();

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (isError || !dashboard) {
    return (
      <div className="paper-panel flex min-h-[320px] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-heading text-3xl text-foreground">Dashboard unavailable</p>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          The workspace could not load its journal data. Refresh the page or retry to
          repopulate the mock state.
        </p>
        <Button onClick={() => retry()} className="rounded-full px-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="space-y-8">
        <header className="animate-fade-up border-b editorial-rule pb-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-3">
              <p className="eyebrow">Today</p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-5xl leading-none text-foreground sm:text-6xl">
                  {dashboard.today.dateLabel}
                </h1>
                <Badge className="rounded-full border-[var(--border)] bg-white/85 px-3 py-1 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  {dashboard.today.streak}-day streak
                </Badge>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                {dashboard.today.note}
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="rounded-full border border-[var(--border)] bg-white/78 px-4 py-2.5 text-sm text-foreground">
                <span className="font-semibold">{dashboard.today.hoursLogged}</span> logged today
              </div>
              <Button
                asChild
                className="h-11 rounded-full bg-[var(--primary)] px-5 text-sm font-semibold text-[var(--foreground)] hover:opacity-90"
              >
                <Link href={TODAY_LOG_ROUTE}>
                  <NotebookPen className="mr-2 size-4" />
                  Log today&apos;s work
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="animate-fade-up [animation-delay:120ms]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Recent entries</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">Latest work logged</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Scan the last few entries to see what is ready for the weekly recap and what still
                needs cleanup.
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              className="rounded-full border-[var(--border)] bg-white/80 text-foreground hover:bg-white"
            >
              <Link href={WEEKLY_ROUTE}>
                Review week
                <ArrowUpRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 border-y editorial-rule">
            {dashboard.recentActivity.map((entry, index) => (
              <article
                key={entry.id}
                className={`relative py-7 pl-10 ${index < dashboard.recentActivity.length - 1 ? "border-b editorial-rule" : ""}`}
              >
                <span className="absolute left-[8px] top-0 h-full w-px bg-[rgba(24,51,45,0.09)]" />
                <span className="absolute left-0 top-9 size-4 rounded-full border border-[var(--primary)] bg-[var(--card)]" />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <p className="eyebrow">
                        {entry.dayLabel} · {entry.dateLabel}
                      </p>
                      <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-foreground">
                        {entry.hours}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold leading-7 text-foreground">
                        {entry.title}
                      </h3>
                      <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                        {entry.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[var(--border)] bg-white/75 px-3 py-1 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {index === 0 ? (
                    <Badge className="rounded-full border-[var(--border)] bg-white px-3 py-1 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                      Latest
                    </Badge>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <aside className="animate-slide-left space-y-8 border-t editorial-rule pt-8 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Progress</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">Hours on record</h2>
            </div>
            <span className="text-sm text-muted-foreground">
              {dashboard.progress.daysRemaining} days left
            </span>
          </div>

          <div className="mt-6">
            <ProgressRing
              value={dashboard.progress.completedHours}
              total={dashboard.progress.targetHours}
            />
          </div>

          <div className="mt-6 divide-y editorial-rule border-y editorial-rule">
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-muted-foreground">Hours remaining</span>
              <span className="font-semibold text-foreground">
                {dashboard.progress.hoursRemaining}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-muted-foreground">Weekly average</span>
              <span className="font-semibold text-foreground">
                {dashboard.progress.weeklyAverage}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-muted-foreground">Logs created</span>
              <span className="font-semibold text-foreground">{dashboard.progress.totalLogs}</span>
            </div>
          </div>
        </section>

        <section className="border-t editorial-rule pt-8">
          <p className="eyebrow">Next document</p>
          <div className="mt-4 flex items-start gap-3">
            <div className="mt-1 flex size-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-foreground">
              <FileText className="size-4" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {dashboard.progress.nextDocument}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {dashboard.progress.missingLogs} missing log days remain before the weekly draft is
                fully grounded.
              </p>
            </div>
          </div>

          <div className="mt-5 border-l-2 border-[rgba(87,195,174,0.42)] pl-4">
            <p className="text-sm font-medium text-foreground">Suggested next step</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Finish today&apos;s entry, then refresh the weekly summary while the details are still
              easy to trace.
            </p>
          </div>
        </section>

        <section className="border-t editorial-rule pt-8">
          <div className="space-y-2">
            <p className="eyebrow">Source board</p>
            <p className="text-sm leading-6 text-muted-foreground">
              Real captures from the journal flow so the next step stays visually anchored during
              demos.
            </p>
          </div>

          <div className="relative mt-6 h-[290px]">
            <div className="animate-drift-soft absolute left-0 top-12 w-[190px] [--drift-rotation:-4deg]">
              <MockShot
                src={dashboard.sourceBoard[0].src}
                alt={dashboard.sourceBoard[0].title}
                title={dashboard.sourceBoard[0].title}
                meta={dashboard.sourceBoard[0].meta}
                imageClassName="object-left-top"
              />
            </div>

            <div className="animate-drift-soft-delay absolute right-0 top-0 z-10 w-[198px] [--drift-rotation:3deg]">
              <MockShot
                src={dashboard.sourceBoard[1].src}
                alt={dashboard.sourceBoard[1].title}
                title={dashboard.sourceBoard[1].title}
                meta={dashboard.sourceBoard[1].meta}
              />
            </div>

            <div className="animate-drift-soft-delay-2 absolute bottom-0 right-6 w-[178px] [--drift-rotation:-2deg]">
              <MockShot
                src={dashboard.sourceBoard[2].src}
                alt={dashboard.sourceBoard[2].title}
                title={dashboard.sourceBoard[2].title}
                meta={dashboard.sourceBoard[2].meta}
              />
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
