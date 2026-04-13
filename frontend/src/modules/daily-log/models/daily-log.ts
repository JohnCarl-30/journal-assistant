export type DailySection = {
  id: string;
  label: string;
  prompt: string;
  content: string;
};

export type Attachment = {
  id: string;
  name: string;
  meta: string;
  previewSrc: string;
  caption: string;
};

export type DailyLogData = {
  isoDate: string;
  headline: string;
  summary: string;
  saveState: string;
  timeIn: string;
  timeOut: string;
  totalHours: string;
  sections: DailySection[];
  attachments: Attachment[];
  aiActions: string[];
};

function formatDateHeadline(isoDate: string) {
  const fallback = {
    headline: "Thursday, Apr 2",
    summary: "Capture the work, blockers, and proof from today while it is still fresh.",
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
    summary: `Capture the most important work from ${headline} while the details are still fresh.`,
  };
}

export function getDailyLogData(isoDate = "2026-04-02"): DailyLogData {
  const formatted = formatDateHeadline(isoDate);

  return {
    isoDate,
    headline: formatted.headline,
    summary: formatted.summary,
    saveState: "Saved 2 minutes ago",
    timeIn: "08:30",
    timeOut: "16:30",
    totalHours: "8.0 hrs",
    sections: [
      {
        id: "work",
        label: "What did you work on?",
        prompt: "Describe the concrete work you shipped, debugged, or pushed forward.",
        content:
          "I translated the dashboard, daily log, weekly summary, and final report screens into one calmer editorial system. The work focused on hierarchy, stronger page framing, and reducing the feeling of isolated cards.",
      },
      {
        id: "blockers",
        label: "Challenges or blockers",
        prompt: "Capture anything that slowed progress or needs follow-up.",
        content:
          "The original layouts drifted between dashboard UI and document UI, so the hardest part was deciding what should be persistent chrome versus page-level context. I solved this by standardizing the left rail and slimming the top bar.",
      },
      {
        id: "learned",
        label: "What did you learn?",
        prompt: "Write the insight you want to remember next week.",
        content:
          "A strong visual system for writing tools relies more on typography, spacing, and controlled contrast than on stacking many cards. The interface feels more premium when the page itself becomes the structure.",
      },
      {
        id: "wins",
        label: "Wins today",
        prompt: "Optional. Call out one thing that felt like progress.",
        content:
          "The report builder now feels like a real paper-first document studio instead of a settings screen with a textarea in the middle.",
      },
    ],
    attachments: [
      {
        id: "wireframe",
        name: "weekly-summary-wireframe.png",
        meta: "Screenshot · 1.8 MB",
        previewSrc: "/mock/weekly-summary-reference.png",
        caption: "Refined the narrative panel and archive rail hierarchy.",
      },
      {
        id: "notes",
        name: "report-outline-reference.pdf",
        meta: "Reference doc · 340 KB",
        previewSrc: "/mock/final-report-reference.png",
        caption: "Used the report canvas as a target for cleaner section flow.",
      },
      {
        id: "feedback",
        name: "mentor-feedback.txt",
        meta: "Notes · 4 comments",
        previewSrc: "/mock/dashboard-reference.png",
        caption: "Checked the dashboard against the shared editorial shell.",
      },
    ],
    aiActions: ["Turn into DTR narrative", "Summarize today", "Expand notes"],
  };
}
