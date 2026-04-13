"use client";

import Link from "next/link";
import { ArrowLeft, ImagePlus, Paperclip, Sparkles } from "lucide-react";

import { useDailyLogViewModel } from "@/modules/daily-log/view-models/use-daily-log-view-model";
import { MockShot } from "@/shared/components/data-display/mock-shot";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { DASHBOARD_ROUTE } from "@/shared/lib/routes";

import { DailyLogLoading } from "./daily-log-loading";

export function DailyLogScreen({ date }: { date: string }) {
  const { dailyLog, isLoading, isError, retry } = useDailyLogViewModel(date);

  if (isLoading) {
    return <DailyLogLoading />;
  }

  if (isError || !dailyLog) {
    return (
      <div className="paper-panel flex min-h-[320px] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-heading text-3xl text-foreground">Daily log unavailable</p>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          The writing desk could not load its entry data. Retry to restore the current
          journal draft.
        </p>
        <Button onClick={() => retry()} className="rounded-full px-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="animate-fade-up border-b editorial-rule pb-8">
        <div className="space-y-3">
          <Link
            href={DASHBOARD_ROUTE}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>

          <div className="space-y-3">
            <p className="eyebrow">Daily log</p>
            <h1 className="font-heading text-5xl leading-none text-foreground sm:text-6xl">
              {dailyLog.headline}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              {dailyLog.summary}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,180px)_minmax(0,180px)_160px_auto]">
          <div>
            <p className="eyebrow">Time in</p>
            <Input
              type="time"
              defaultValue={dailyLog.timeIn}
              className="mt-2 h-11 rounded-2xl border-[var(--border)] bg-white/82 px-4 text-sm"
            />
          </div>
          <div>
            <p className="eyebrow">Time out</p>
            <Input
              type="time"
              defaultValue={dailyLog.timeOut}
              className="mt-2 h-11 rounded-2xl border-[var(--border)] bg-white/82 px-4 text-sm"
            />
          </div>
          <div className="rounded-[1.35rem] border border-[var(--border)] bg-white/78 px-4 py-3">
            <p className="eyebrow">Total</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{dailyLog.totalHours}</p>
          </div>
          <div className="flex items-end md:justify-end">
            <Badge className="rounded-full border-[var(--border)] bg-white/85 px-3 py-1 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              {dailyLog.saveState}
            </Badge>
          </div>
        </div>
      </section>

      <article className="editorial-surface animate-fade-up p-6 [animation-delay:100ms] sm:p-8 lg:p-10">
        <div className="mx-auto max-w-4xl space-y-10">
          <div className="flex items-center justify-between gap-4 border-b editorial-rule pb-5">
            <div>
              <p className="eyebrow">Writing desk</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Capture the work, friction, and learning before you turn it into a summary.
              </p>
            </div>

            <div className="hidden rounded-full border border-[var(--border)] bg-white/78 px-4 py-2 text-sm text-muted-foreground lg:block">
              {dailyLog.isoDate}
            </div>
          </div>

          <div className="space-y-8">
            {dailyLog.sections.map((section, index) => (
              <div key={section.id} className="space-y-4">
                <div className="space-y-2">
                  <p className="eyebrow">{section.label}</p>
                  <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                    {section.prompt}
                  </p>
                </div>

                <Textarea
                  defaultValue={section.content}
                  className={`resize-none border-none bg-transparent px-0 py-0 text-base leading-8 text-foreground shadow-none focus-visible:ring-0 ${index === 0 ? "min-h-[180px]" : "min-h-[130px]"}`}
                />

                {index < dailyLog.sections.length - 1 ? (
                  <Separator className="soft-divider" />
                ) : null}
              </div>
            ))}
          </div>

          <div className="border-t editorial-rule pt-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="eyebrow">AI helpers</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Move this draft forward one deliberate step at a time.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {dailyLog.aiActions.map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    className="h-10 rounded-full border-[var(--border)] bg-white/84 px-4 text-sm text-foreground hover:bg-white"
                  >
                    <Sparkles className="mr-2 size-4" />
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t editorial-rule pt-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-sm">
                <p className="eyebrow">Evidence tray</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Add screenshots or quick proof points that keep the weekly summary grounded in
                  real work.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 lg:max-w-[760px]">
                <div className="paper-tint rounded-[1.6rem] border border-dashed border-[var(--border)] px-5 py-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-full bg-[var(--accent-soft)] text-foreground">
                        <ImagePlus className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Drag screenshot or photo here
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          JPG, PNG, or PDF up to 5 MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-full border-[var(--border)] bg-white/85 px-4 text-foreground hover:bg-white"
                    >
                      Browse files
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-[1.2fr_.9fr_.9fr]">
                  {dailyLog.attachments.map((attachment, index) => (
                    <MockShot
                      key={attachment.id}
                      src={attachment.previewSrc}
                      alt={attachment.name}
                      title={attachment.name}
                      meta={`${attachment.meta} · ${attachment.caption}`}
                      className={index === 0 ? "animate-drift-soft" : "animate-fade-up"}
                    />
                  ))}
                </div>

                <div className="rounded-[1.35rem] border border-[var(--border)] bg-white/74 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-foreground">
                      <Paperclip className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Attachments stay linked to later drafts
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        These screenshots can be cited again when you refresh the weekly summary or
                        pull details into the final report.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
