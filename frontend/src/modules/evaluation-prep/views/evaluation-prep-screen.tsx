"use client";

import { Sparkles } from "lucide-react";

import { useEvaluationPrepViewModel } from "@/modules/evaluation-prep/view-models/use-evaluation-prep-view-model";
import { MockShot } from "@/shared/components/data-display/mock-shot";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

import { EvaluationPrepLoading } from "./evaluation-prep-loading";

export function EvaluationPrepScreen() {
  const { evaluationPrep, isLoading, isError, retry } = useEvaluationPrepViewModel();

  if (isLoading) {
    return <EvaluationPrepLoading />;
  }

  if (isError || !evaluationPrep) {
    return (
      <div className="paper-panel flex min-h-[320px] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-heading text-3xl text-foreground">Evaluation prep unavailable</p>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          The supervisor prep notes could not load. Retry to restore the current talking
          points.
        </p>
        <Button onClick={() => retry()} className="rounded-full px-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
      <section className="space-y-6">
        <div className="animate-fade-up space-y-3 border-b editorial-rule pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">Supervisor prep</p>
            <Badge className="rounded-full border-[var(--border)] bg-white/85 px-3 py-1 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              {evaluationPrep.updatedLabel}
            </Badge>
          </div>

          <div className="space-y-3">
            <h1 className="font-heading text-5xl leading-none text-foreground sm:text-6xl">
              {evaluationPrep.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              {evaluationPrep.subtitle}
            </p>
          </div>
        </div>

        <div className="animate-fade-up flex flex-wrap gap-3 border-y editorial-rule py-4 [animation-delay:90ms]">
          <div className="rounded-full border border-[var(--border)] bg-white/84 px-4 py-2 text-sm text-foreground">
            <span className="font-semibold">{evaluationPrep.sourceSummary.summariesReviewed}</span>{" "}
            weekly summaries
          </div>
          <div className="rounded-full border border-[var(--border)] bg-white/84 px-4 py-2 text-sm text-foreground">
            <span className="font-semibold">{evaluationPrep.sourceSummary.loggedHours}</span>{" "}
            logged
          </div>
          <div className="rounded-full border border-[var(--border)] bg-white/84 px-4 py-2 text-sm text-foreground">
            <span className="font-semibold">{evaluationPrep.sourceSummary.evidencePoints}</span>{" "}
            evidence points
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="paper-sheet animate-fade-up p-6 [animation-delay:120ms] sm:p-8">
            <div className="space-y-2 border-b editorial-rule pb-5">
              <p className="eyebrow">Strengths with evidence</p>
              <p className="text-sm leading-6 text-muted-foreground">
                These are the talking points worth leading with in the conversation.
              </p>
            </div>

            <div className="mt-6 space-y-6">
              {evaluationPrep.strengths.map((item, index) => (
                <article
                  key={item.id}
                  className={index > 0 ? "border-t editorial-rule pt-6" : ""}
                >
                  <h2 className="text-xl font-semibold text-foreground">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.summary}</p>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                    {item.evidence.map((evidence) => (
                      <li key={evidence} className="flex gap-3">
                        <span className="mt-2 size-1.5 rounded-full bg-[var(--primary)]" />
                        <span>{evidence}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="paper-sheet animate-fade-up p-6 [animation-delay:180ms] sm:p-8">
            <div className="space-y-2 border-b editorial-rule pb-5">
              <p className="eyebrow">Growth areas</p>
              <p className="text-sm leading-6 text-muted-foreground">
                These keep the conversation balanced and show self-awareness.
              </p>
            </div>

            <div className="mt-6 space-y-6">
              {evaluationPrep.growthAreas.map((item, index) => (
                <article
                  key={item.id}
                  className={index > 0 ? "border-t editorial-rule pt-6" : ""}
                >
                  <h2 className="text-xl font-semibold text-foreground">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.summary}</p>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                    {item.evidence.map((evidence) => (
                      <li key={evidence} className="flex gap-3">
                        <span className="mt-2 size-1.5 rounded-full bg-[var(--warning)]" />
                        <span>{evidence}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="paper-sheet animate-fade-up p-6 [animation-delay:220ms] sm:p-8">
          <div className="flex flex-col gap-4 border-b editorial-rule pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <p className="eyebrow">Likely questions</p>
              <p className="text-sm leading-6 text-muted-foreground">
                Practice short, concrete answers that start from what you actually shipped.
              </p>
            </div>

            <Button
              variant="outline"
              className="rounded-full border-[var(--border)] bg-white/78 px-4 text-foreground hover:bg-white"
            >
              <Sparkles className="mr-2 size-4" />
              Refresh talking points
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            {evaluationPrep.likelyQuestions.map((question) => (
              <article
                key={question.id}
                className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.75)] px-5 py-5"
              >
                <p className="text-base font-semibold leading-7 text-foreground">
                  {question.question}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {question.answer}
                </p>
              </article>
            ))}
          </div>
        </section>
      </section>

      <aside className="animate-slide-left space-y-6 border-t editorial-rule pt-8 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
        <section className="space-y-3">
          <p className="eyebrow">Source captures</p>
          <p className="text-sm leading-6 text-muted-foreground">
            Visual proof points you can mention when explaining what you improved.
          </p>

          {evaluationPrep.sourceCaptures.map((capture, index) => (
            <MockShot
              key={capture.id}
              src={capture.src}
              alt={capture.title}
              title={capture.title}
              meta={capture.meta}
              className={index === 0 ? "animate-drift-soft" : "animate-fade-up"}
            />
          ))}
        </section>

        <section className="rounded-[1.6rem] border border-[rgba(87,195,174,0.28)] bg-[var(--accent-soft)] px-5 py-5">
          <p className="eyebrow">Coach note</p>
          <p className="mt-3 text-sm leading-7 text-foreground">{evaluationPrep.coachNote}</p>
        </section>
      </aside>
    </div>
  );
}
