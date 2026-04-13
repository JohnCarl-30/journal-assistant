"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, Paperclip, Plus, Sparkles, Trash2 } from "lucide-react";

import { useDailyLogViewModel } from "@/modules/daily-log/view-models/use-daily-log-view-model";
import { MockShot } from "@/shared/components/data-display/mock-shot";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { DASHBOARD_ROUTE } from "@/shared/lib/routes";

import { DailyLogLoading } from "./daily-log-loading";

type EntryEditorProps = {
  id: string;
  initialTitle: string;
  initialContent: string;
  onSave: (payload: { title: string; content_md: string }) => Promise<unknown>;
  onDelete: () => Promise<unknown>;
};

function EntryEditor({
  id,
  initialTitle,
  initialContent,
  onSave,
  onDelete,
}: EntryEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent]);

  async function handleSave() {
    setIsPending(true);
    try {
      await onSave({ title, content_md: content });
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete() {
    setIsPending(true);
    try {
      await onDelete();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <article className="rounded-[1.6rem] border border-[var(--border)] bg-[rgba(255,255,255,0.78)] px-5 py-5">
      <div className="flex flex-col gap-4 border-b editorial-rule pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="eyebrow">Entry {id.slice(0, 6)}</p>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-11 rounded-2xl border-[var(--border)] bg-white/88 px-4 text-sm font-semibold"
            placeholder="Give this entry a short headline"
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => void handleSave()}
            disabled={isPending}
            className="rounded-full border-[var(--border)] bg-white/84 px-4 text-foreground hover:bg-white"
          >
            {isPending ? "Saving..." : "Save entry"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => void handleDelete()}
            disabled={isPending}
            className="rounded-full border-[var(--border)] bg-white/84 px-4 text-foreground hover:bg-white"
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </Button>
        </div>
      </div>

      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        className="mt-5 min-h-[180px] resize-none border-none bg-transparent px-0 py-0 text-base leading-8 text-foreground shadow-none focus-visible:ring-0"
        placeholder="Document one focused piece of work, a blocker, or something you learned."
      />
    </article>
  );
}

export function DailyLogScreen({ date }: { date: string }) {
  const { dailyLog, isLoading, isError, isSaving, retry, updateWorkDay, createEntry, updateEntry, deleteEntry } =
    useDailyLogViewModel(date);
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!dailyLog) {
      return;
    }
    setTimeIn(dailyLog.timeIn);
    setTimeOut(dailyLog.timeOut);
  }, [dailyLog]);

  if (isLoading) {
    return <DailyLogLoading />;
  }

  if (isError || !dailyLog) {
    return (
      <div className="paper-panel flex min-h-[320px] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-heading text-3xl text-foreground">Daily log unavailable</p>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          The writing desk could not load its live backend data. Retry to restore the current
          journal draft.
        </p>
        <Button onClick={() => retry()} className="rounded-full px-4">
          Retry
        </Button>
      </div>
    );
  }

  async function handleCreateEntry() {
    if (!newTitle.trim() || !newContent.trim()) {
      return;
    }
    setIsCreating(true);
    try {
      await createEntry({
        title: newTitle.trim(),
        content_md: newContent.trim(),
      });
      setNewTitle("");
      setNewContent("");
    } finally {
      setIsCreating(false);
    }
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

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,180px)_minmax(0,180px)_160px_auto_auto]">
          <div>
            <p className="eyebrow">Time in</p>
            <Input
              type="time"
              value={timeIn}
              onChange={(event) => setTimeIn(event.target.value)}
              className="mt-2 h-11 rounded-2xl border-[var(--border)] bg-white/82 px-4 text-sm"
            />
          </div>
          <div>
            <p className="eyebrow">Time out</p>
            <Input
              type="time"
              value={timeOut}
              onChange={(event) => setTimeOut(event.target.value)}
              className="mt-2 h-11 rounded-2xl border-[var(--border)] bg-white/82 px-4 text-sm"
            />
          </div>
          <div className="rounded-[1.35rem] border border-[var(--border)] bg-white/78 px-4 py-3">
            <p className="eyebrow">Total</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{dailyLog.totalHours}</p>
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              onClick={() =>
                void updateWorkDay({
                  time_in_local: timeIn || null,
                  time_out_local: timeOut || null,
                })
              }
              disabled={isSaving}
              className="h-11 rounded-full bg-[var(--primary)] px-5 text-sm font-semibold text-[var(--foreground)] hover:opacity-90"
            >
              {isSaving ? "Saving..." : "Save hours"}
            </Button>
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
                Add as many focused entries as you need for the day. Each one persists through the
                backend and can be reused later in summaries and the report.
              </p>
            </div>

            <div className="hidden rounded-full border border-[var(--border)] bg-white/78 px-4 py-2 text-sm text-muted-foreground lg:block">
              {dailyLog.isoDate}
            </div>
          </div>

          <div className="space-y-5">
            {dailyLog.entries.length === 0 ? (
              <div className="rounded-[1.6rem] border border-dashed border-[var(--border)] bg-[rgba(255,255,255,0.68)] px-5 py-6 text-sm leading-7 text-muted-foreground">
                No entries yet for this day. Start with one focused note about what you built,
                fixed, or learned.
              </div>
            ) : null}

            {dailyLog.entries.map((entry) => (
              <EntryEditor
                key={entry.id}
                id={entry.id}
                initialTitle={entry.title}
                initialContent={entry.content}
                onSave={(payload) => updateEntry(entry.id, payload)}
                onDelete={() => deleteEntry(entry.id)}
              />
            ))}
          </div>

          <div className="border-t editorial-rule pt-6">
            <div className="space-y-4 rounded-[1.6rem] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-5 py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="eyebrow">New entry</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Split the day into smaller notes so the weekly recap stays easier to trace.
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={() => void handleCreateEntry()}
                  disabled={isCreating}
                  className="rounded-full bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--foreground)] hover:opacity-90"
                >
                  <Plus className="mr-2 size-4" />
                  {isCreating ? "Adding..." : "Add entry"}
                </Button>
              </div>

              <Input
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                className="h-11 rounded-2xl border-[var(--border)] bg-white/82 px-4 text-sm"
                placeholder="Entry title"
              />
              <Textarea
                value={newContent}
                onChange={(event) => setNewContent(event.target.value)}
                className="min-h-[160px] resize-none rounded-[1.5rem] border-[var(--border)] bg-white/82 px-5 py-4 text-base leading-8 text-foreground shadow-none focus-visible:ring-0"
                placeholder="What happened in this part of the day?"
              />
            </div>
          </div>

          <div className="border-t editorial-rule pt-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="eyebrow">AI helpers</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  These stay visible as the next generation milestone, but daily logging is now
                  backed by real API data first.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {dailyLog.aiActions.map((action) => (
                  <Button
                    key={action}
                    type="button"
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
                  Uploads are still deferred, but the tray stays here so the writing desk keeps the
                  same shape as the rest of the product.
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
                          Upload flow deferred to a later milestone
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
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
                        Attachments remain the next content milestone
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        The real slice for this pass is auth plus persistent daily logs. Uploads and
                        AI-powered drafting stay scaffolded until the next round.
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
