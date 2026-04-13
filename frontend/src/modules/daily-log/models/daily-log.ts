import type { JournalEntryDTO, WorkDayDTO } from "@/shared/lib/backend-types";

export type Attachment = {
  id: string;
  name: string;
  meta: string;
  previewSrc: string;
  caption: string;
};

export type DailyLogEntry = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
};

export type DailyLogData = {
  isoDate: string;
  headline: string;
  summary: string;
  saveState: string;
  timeIn: string;
  timeOut: string;
  totalHours: string;
  entries: DailyLogEntry[];
  attachments: Attachment[];
  aiActions: string[];
};

export type DailyLogPayload = {
  workDay: WorkDayDTO;
  entries: JournalEntryDTO[];
};

function formatDateHeadline(isoDate: string) {
  const fallback = {
    headline: "Daily log",
    summary: "Capture the work while the details are still fresh.",
  };

  const parsed = new Date(`${isoDate}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  const headline = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(parsed);

  return {
    headline,
    summary: `Add multiple focused entries for ${headline}, then use them later for summaries and the final report.`,
  };
}

function formatHours(minutes: number) {
  const hours = minutes / 60;
  return `${Number.isInteger(hours) ? hours.toFixed(0) : hours.toFixed(1)} hrs`;
}

function formatSaveState(updatedAt: string | null) {
  if (!updatedAt) {
    return "Live backend data";
  }

  const parsed = new Date(updatedAt);
  if (Number.isNaN(parsed.getTime())) {
    return "Live backend data";
  }

  const minutes = Math.max(0, Math.round((Date.now() - parsed.getTime()) / (1000 * 60)));
  if (minutes < 1) {
    return "Saved just now";
  }
  if (minutes === 1) {
    return "Saved 1 minute ago";
  }
  return `Saved ${minutes} minutes ago`;
}

export function buildDailyLogData(
  isoDate: string,
  payload: DailyLogPayload,
): DailyLogData {
  const formatted = formatDateHeadline(isoDate);
  const latestUpdatedAt =
    payload.entries
      .map((entry) => entry.updated_at)
      .sort()
      .at(-1) ?? null;

  return {
    isoDate,
    headline: formatted.headline,
    summary: formatted.summary,
    saveState: formatSaveState(latestUpdatedAt),
    timeIn: payload.workDay.time_in_local ?? "",
    timeOut: payload.workDay.time_out_local ?? "",
    totalHours: formatHours(payload.workDay.total_minutes),
    entries: payload.entries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      content: entry.content_md,
      updatedAt: entry.updated_at,
    })),
    attachments: [
      {
        id: "weekly-reference",
        name: "weekly-summary-reference.png",
        meta: "Screenshot · linked later",
        previewSrc: "/mock/weekly-summary-reference.png",
        caption: "This stays as a visual reference while the upload flow is still deferred.",
      },
      {
        id: "report-reference",
        name: "final-report-reference.png",
        meta: "Screenshot · linked later",
        previewSrc: "/mock/final-report-reference.png",
        caption: "Useful for showing where today’s entries will eventually flow.",
      },
      {
        id: "dashboard-reference",
        name: "dashboard-reference.png",
        meta: "Screenshot · linked later",
        previewSrc: "/mock/dashboard-reference.png",
        caption: "Keeps the dashboard and daily log visually aligned during the vertical slice.",
      },
    ],
    aiActions: ["Turn into DTR narrative", "Summarize today", "Expand notes"],
  };
}
