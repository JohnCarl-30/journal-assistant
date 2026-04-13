"use client";

import Link from "next/link";
import { Paperclip, Sparkles } from "lucide-react";

import { useWeeklySummaryViewModel } from "@/modules/weekly-summary/view-models/use-weekly-summary-view-model";
import { MockShot } from "@/shared/components/data-display/mock-shot";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { weekRoute } from "@/shared/lib/routes";

import { WeeklySummaryLoading } from "./weekly-summary-loading";

export function WeeklySummaryScreen({ weekStart }: { weekStart: string }) {
  const { weeklySummary, isLoading, isError, retry } = useWeeklySummaryViewModel(weekStart);

  if (isLoading) {
    return <WeeklySummaryLoading />;
  }

  if (isError || !weeklySummary) {
    return (
      <div className="paper-panel flex min-h-[320px] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-heading text-3xl text-foreground">Weekly summary unavailable</p>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          The recap workspace could not load the active week. Retry to repopulate the
          summary draft.
        </p>
        <Button onClick={() => retry()} className="rounded-full px-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[190px_minmax(0,1fr)]">
      <aside className="animate-slide-right h-fit border-b editorial-rule pb-6 lg:sticky lg:top-24 lg:border-b-0 lg:border-r lg:pr-6">
        <p className="eyebrow">Archive</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Move week by week and keep each recap tied to real entries.
        </p>

        <div className="mt-5 space-y-1.5">
          {weeklySummary.weeks.map((week) => (
            <Link
              key={week.id}
              href={weekRoute(week.weekStart)}
              className={`hover-tint w-full rounded-[1.25rem] border px-4 py-3 text-left ${
                week.active
                  ? "border-[rgba(87,195,174,0.42)] bg-[var(--accent-soft)]"
                  : "border-transparent bg-white/45"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{week.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{week.range}</p>
                </div>
                {week.active ? (
                  <span className="size-2 rounded-full bg-[var(--primary)]" />
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </aside>

      <section className="space-y-6">
        <div className="animate-fade-up space-y-3 border-b editorial-rule pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">Weekly summary</p>
            <Badge className="rounded-full border-[var(--border)] bg-white/80 px-3 py-1 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              {weeklySummary.state}
            </Badge>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-heading text-5xl leading-none text-foreground sm:text-6xl">
                {weeklySummary.title}
              </h1>
              <p className="mt-3 text-base text-muted-foreground">{weeklySummary.range}</p>
            </div>
            <div className="rounded-full border border-[var(--border)] bg-white/75 px-4 py-2 text-sm font-semibold text-foreground">
              {weeklySummary.totalHours}
            </div>
          </div>
        </div>

        <div className="animate-fade-up flex flex-wrap gap-3 border-y editorial-rule py-4 [animation-delay:90ms]">
          <div className="rounded-full border border-[var(--border)] bg-white/84 px-4 py-2 text-sm text-foreground">
            <span className="font-semibold">{weeklySummary.sourceSummary.entries}</span> entries
          </div>
          <div className="rounded-full border border-[var(--border)] bg-white/84 px-4 py-2 text-sm text-foreground">
            <span className="font-semibold">{weeklySummary.sourceSummary.hours}</span> logged
          </div>
          <div className="rounded-full border border-[var(--border)] bg-white/84 px-4 py-2 text-sm text-foreground">
            <span className="font-semibold">{weeklySummary.sourceSummary.highlights}</span>{" "}
            highlights selected
          </div>
        </div>

        <div className="animate-fade-up grid gap-3 [animation-delay:120ms] md:grid-cols-3">
          {weeklySummary.evidenceShots.map((shot, index) => (
            <MockShot
              key={shot.id}
              src={shot.src}
              alt={shot.title}
              title={shot.title}
              meta={shot.meta}
              className={index === 1 ? "animate-drift-soft" : "animate-fade-up"}
            />
          ))}
        </div>

        <div className="paper-sheet animate-fade-up p-6 [animation-delay:150ms] sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow">DTR narrative</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Keep the draft grounded in what actually happened this week, then refine the
                tone before exporting it.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-[var(--border)] bg-white/70 px-4 text-foreground hover:bg-white"
            >
              <Sparkles className="mr-2 size-4" />
              Refine narrative
            </Button>
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-[rgba(87,195,174,0.32)] bg-[var(--accent-soft)] p-5">
            <Textarea
              defaultValue={weeklySummary.narrative}
              className="min-h-[180px] resize-none border-none bg-transparent px-0 py-0 text-base leading-8 text-foreground shadow-none focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="animate-fade-up [animation-delay:240ms]">
          <div className="space-y-2">
            <p className="eyebrow">Daily log recap</p>
            <h2 className="text-2xl font-semibold text-foreground">The story of the week</h2>
          </div>

          <div className="mt-8 border-y editorial-rule">
            {weeklySummary.recapDays.map((day, index) => (
              <article
                key={day.id}
                className={`relative py-7 pl-10 ${index < weeklySummary.recapDays.length - 1 ? "border-b editorial-rule" : ""}`}
              >
                <span className="absolute left-[8px] top-0 h-full w-px bg-[rgba(24,51,45,0.09)]" />
                <span className="absolute left-0 top-9 size-4 rounded-full border border-[var(--primary)] bg-[var(--card)]" />

                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="max-w-2xl space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-semibold text-foreground">
                        {day.day}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          {day.date}
                        </span>
                      </p>
                      <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-foreground">
                        {day.hours}
                      </span>
                    </div>
                    <p className="text-sm font-medium leading-6 text-foreground">{day.focus}</p>
                    <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                      {day.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-2 size-1.5 rounded-full bg-[var(--primary)]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs text-muted-foreground">
                    <Paperclip className="size-3.5" />
                    {day.attachments} attachments
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
