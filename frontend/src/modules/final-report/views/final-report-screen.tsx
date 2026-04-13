"use client";

import { Check, Copy, Sparkles } from "lucide-react";

import { useFinalReportViewModel } from "@/modules/final-report/view-models/use-final-report-view-model";
import { MockShot } from "@/shared/components/data-display/mock-shot";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";

import { FinalReportLoading } from "./final-report-loading";

export function FinalReportScreen() {
  const {
    report,
    copiedId,
    isLoading,
    isError,
    retry,
    copyReferenceValue,
  } = useFinalReportViewModel();

  if (isLoading) {
    return <FinalReportLoading />;
  }

  if (isError || !report) {
    return (
      <div className="paper-panel flex min-h-[320px] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-heading text-3xl text-foreground">Report builder unavailable</p>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          The writing canvas could not load the active report draft. Retry to restore the
          current outline and reference data.
        </p>
        <Button onClick={() => retry()} className="rounded-full px-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_270px]">
      <aside className="animate-slide-right h-fit border-b editorial-rule pb-6 xl:sticky xl:top-24 xl:border-b-0 xl:border-r xl:pr-6">
        <div className="space-y-2">
          <p className="eyebrow">Outline</p>
          <p className="text-base font-semibold text-foreground">Final internship report</p>
        </div>

        <div className="mt-5 space-y-2">
          {report.sections.map((section) => {
            const active = section.state === "active";
            const complete = section.state === "done";

            return (
              <button
                key={section.id}
                type="button"
                className={`hover-tint flex w-full items-center gap-3 rounded-[1.35rem] border px-4 py-3 text-left ${
                  active
                    ? "border-[rgba(87,195,174,0.42)] bg-[var(--accent-soft)]"
                    : "border-transparent bg-white/45"
                }`}
              >
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                    complete
                      ? "border-transparent bg-[var(--primary)] text-[var(--foreground)]"
                      : active
                        ? "border-[var(--primary)] bg-white text-foreground"
                        : "border-[var(--border)] bg-white text-muted-foreground"
                  }`}
                >
                  {complete ? <Check className="size-3.5" /> : null}
                </span>
                <span className="text-sm font-medium text-foreground">{section.title}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="paper-sheet animate-fade-up min-h-[780px] p-6 sm:p-8 lg:p-12">
        <div className="mx-auto max-w-3xl space-y-10">
          <div className="space-y-4 border-b editorial-rule pb-8">
            <div className="flex flex-wrap items-center gap-3">
              <p className="eyebrow">Current section</p>
              <Badge className="rounded-full border-[var(--border)] bg-white/80 px-3 py-1 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                {report.saveState}
              </Badge>
              <Badge className="rounded-full border-[var(--border)] bg-white/80 px-3 py-1 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                {report.wordCount} words
              </Badge>
            </div>
            <div>
              <h1 className="font-heading text-5xl leading-none text-foreground sm:text-6xl">
                {report.activeSection}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                {report.intro}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {report.assistantActions.map((action) => (
              <Button
                key={action}
                variant="outline"
                className="h-10 rounded-full border-[var(--border)] bg-white/82 px-4 text-sm text-foreground hover:bg-white"
              >
                <Sparkles className="mr-2 size-4" />
                {action}
              </Button>
            ))}
          </div>

          <div className="space-y-8">
            {report.blocks.map((block, index) => (
              <div
                key={block.id}
                className={`space-y-3 ${index > 0 ? "border-t editorial-rule pt-8" : ""}`}
              >
                <div className="space-y-1">
                  <p className="eyebrow">{block.heading}</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Build the section carefully, then trim repetition once the core details
                    are in place.
                  </p>
                </div>
                <Textarea
                  defaultValue={block.text}
                  className="min-h-[170px] resize-none rounded-[1.5rem] border-[var(--border)] bg-[rgba(245,247,243,0.62)] px-5 py-4 text-base leading-8 text-foreground shadow-none focus-visible:ring-0"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="animate-slide-left hidden h-fit border-l editorial-rule pl-6 xl:block xl:sticky xl:top-24">
        <div className="space-y-3 border-b editorial-rule pb-6">
          <div className="space-y-2">
            <p className="eyebrow">Source captures</p>
            <p className="text-sm leading-6 text-muted-foreground">
              Quick visual references from the weekly and daily flows while you shape the final
              write-up.
            </p>
          </div>

          {report.sourceCaptures.map((capture, index) => (
            <MockShot
              key={capture.id}
              src={capture.src}
              alt={capture.title}
              title={capture.title}
              meta={capture.meta}
              className={index === 0 ? "animate-drift-soft" : "animate-fade-up"}
            />
          ))}
        </div>

        <div className="space-y-2 pt-6">
          <p className="eyebrow">Reference data</p>
          <p className="text-sm leading-6 text-muted-foreground">
            Quick copy-paste context for the current draft. Tap any row to copy it directly
            into the editor.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {report.referenceGroups.map((group, index) => (
            <div
              key={group.id}
              className={index > 0 ? "border-t editorial-rule pt-4" : ""}
            >
              <p className="eyebrow">{group.label}</p>
              <div className="mt-3 space-y-2">
                {group.items.map((item) => {
                  const copied = copiedId === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => copyReferenceValue(item.id, item.value)}
                      className="hover-tint flex w-full items-start justify-between gap-3 rounded-2xl border border-transparent px-3 py-3 text-left"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm font-medium leading-6 text-foreground">
                          {item.value}
                        </p>
                      </div>

                      <span className="mt-0.5 text-muted-foreground">
                        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
