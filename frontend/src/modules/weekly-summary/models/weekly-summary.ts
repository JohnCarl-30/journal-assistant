export type WeekItem = {
  id: string;
  label: string;
  range: string;
  weekStart: string;
  active?: boolean;
};

export type DayRecap = {
  id: string;
  day: string;
  date: string;
  hours: string;
  focus: string;
  bullets: string[];
  attachments: number;
};

export type WeeklySummaryData = {
  title: string;
  range: string;
  totalHours: string;
  state: string;
  weeks: WeekItem[];
  sourceSummary: {
    entries: number;
    hours: string;
    highlights: number;
  };
  evidenceShots: Array<{
    id: string;
    src: string;
    title: string;
    meta: string;
  }>;
  narrative: string;
  recapDays: DayRecap[];
};

const weekPresets = [
  {
    id: "week-5",
    weekStart: "2026-04-06",
    label: "Week 5",
    range: "Apr 6 - Apr 10",
    totalHours: "30 hrs",
    state: "Awaiting refresh",
    narrative:
      "This week I focused on tightening the product around completion. I cleaned smaller interaction details, reviewed report language, and prepared the workspace for handoff by clarifying what still needed daily evidence and what was already ready for export.",
    sourceSummary: { entries: 4, hours: "30 hrs", highlights: 2 },
    recapDays: [
      {
        id: "monday",
        day: "Monday",
        date: "Apr 6",
        hours: "7 hrs",
        focus: "Reviewed the weekly-to-report handoff.",
        bullets: [
          "Mapped where weekly recap language was too repetitive for the report.",
          "Flagged which sections still needed stronger evidence.",
        ],
        attachments: 1,
      },
      {
        id: "tuesday",
        day: "Tuesday",
        date: "Apr 7",
        hours: "7.5 hrs",
        focus: "Tightened utility copy across the product surfaces.",
        bullets: [
          "Removed marketing-style copy from product UI.",
          "Clarified labels so students can scan actions faster.",
        ],
        attachments: 2,
      },
      {
        id: "wednesday",
        day: "Wednesday",
        date: "Apr 8",
        hours: "8 hrs",
        focus: "Prepared evaluation prep prompts.",
        bullets: [
          "Collected concrete strengths with evidence.",
          "Drafted likely supervisor questions and answer angles.",
        ],
        attachments: 1,
      },
      {
        id: "thursday",
        day: "Thursday",
        date: "Apr 9",
        hours: "7.5 hrs",
        focus: "Closed the week with cleanup and export checks.",
        bullets: [
          "Checked the print layout for report readability.",
          "Polished route alignment for the v1 surface set.",
        ],
        attachments: 2,
      },
    ],
  },
  {
    id: "week-4",
    weekStart: "2026-03-30",
    label: "Week 4",
    range: "Mar 30 - Apr 3",
    totalHours: "32 hrs",
    state: "Draft refreshed 5 mins ago",
    narrative:
      "This week I focused on turning the internship journal into a calmer editorial product. I unified the dashboard, daily log, weekly summary, and report builder under one shell, improved information hierarchy, and reshaped the writing flows so they feel more deliberate and more useful for academic reporting.",
    sourceSummary: { entries: 5, hours: "32 hrs", highlights: 3 },
    recapDays: [
      {
        id: "monday",
        day: "Monday",
        date: "Mar 30",
        hours: "8 hrs",
        focus: "Established the shared shell and visual system.",
        bullets: [
          "Defined the typography pair and the restrained mint palette.",
          "Built the persistent left rail and slim top bar layout.",
          "Set the paper surface styles and subtle entrance motion.",
        ],
        attachments: 2,
      },
      {
        id: "tuesday",
        day: "Tuesday",
        date: "Mar 31",
        hours: "7.5 hrs",
        focus: "Rebuilt the daily log as a guided writing desk.",
        bullets: [
          "Introduced time-in, time-out, and total hours in a compact control group.",
          "Split the journal into guided prompts instead of one empty field.",
          "Moved evidence into a slim tray and placed AI helpers beneath the editor.",
        ],
        attachments: 1,
      },
      {
        id: "wednesday",
        day: "Wednesday",
        date: "Apr 1",
        hours: "8 hrs",
        focus: "Turned the report builder into a document-first canvas.",
        bullets: [
          "Added progress-aware section outline on the left.",
          "Reworked the middle panel into a print-aware paper sheet.",
          "Grouped side reference data into internship, hours, people, and dates.",
        ],
        attachments: 3,
      },
      {
        id: "thursday",
        day: "Thursday",
        date: "Apr 2",
        hours: "8.5 hrs",
        focus: "Refined weekly summaries into a stronger recap workflow.",
        bullets: [
          "Simplified the week archive into an issue-like list.",
          "Promoted the DTR narrative into an editable quote block.",
          "Replaced floating cards with a cleaner vertical story of the week.",
        ],
        attachments: 2,
      },
    ],
  },
  {
    id: "week-3",
    weekStart: "2026-03-23",
    label: "Week 3",
    range: "Mar 23 - Mar 27",
    totalHours: "28 hrs",
    state: "Archived",
    narrative:
      "Week 3 focused on building the first complete pass of the product shell, making sure the main screens shared a calmer foundation before heavier feature polish began.",
    sourceSummary: { entries: 4, hours: "28 hrs", highlights: 2 },
    recapDays: [
      {
        id: "monday",
        day: "Monday",
        date: "Mar 23",
        hours: "7 hrs",
        focus: "Outlined the main product surfaces.",
        bullets: [
          "Defined the dashboard, journal, weekly summary, and report builder flows.",
          "Mapped the most important student actions for each route.",
        ],
        attachments: 1,
      },
      {
        id: "tuesday",
        day: "Tuesday",
        date: "Mar 24",
        hours: "7 hrs",
        focus: "Started the editorial shell.",
        bullets: [
          "Explored a calmer left-rail layout.",
          "Tested a slimmer top bar with status-first content.",
        ],
        attachments: 1,
      },
      {
        id: "wednesday",
        day: "Wednesday",
        date: "Mar 25",
        hours: "7 hrs",
        focus: "Structured the writing surfaces.",
        bullets: [
          "Planned how daily notes should turn into weekly summaries.",
          "Mapped which information belongs beside the canvas versus inside it.",
        ],
        attachments: 1,
      },
      {
        id: "thursday",
        day: "Thursday",
        date: "Mar 26",
        hours: "7 hrs",
        focus: "Reviewed the end-to-end product story.",
        bullets: [
          "Checked that the planned screens support OJT reporting needs.",
          "Prepared the next week for deeper UI refinement.",
        ],
        attachments: 1,
      },
    ],
  },
];

export function getWeeklySummaryData(weekStart = "2026-03-30"): WeeklySummaryData {
  const activeWeek = weekPresets.find((preset) => preset.weekStart === weekStart) ?? weekPresets[1];

  return {
    title: `${activeWeek.label} Summary`,
    range: `${activeWeek.range}, 2026`,
    totalHours: activeWeek.totalHours,
    state: activeWeek.state,
    weeks: weekPresets.map((preset) => ({
      id: preset.id,
      label: preset.label,
      range: preset.range,
      weekStart: preset.weekStart,
      active: preset.weekStart === activeWeek.weekStart,
    })),
    sourceSummary: activeWeek.sourceSummary,
    evidenceShots: [
      {
        id: "daily",
        src: "/mock/daily-log-reference.png",
        title: "Daily prompts",
        meta: "Source notes pulled from the guided writing desk.",
      },
      {
        id: "weekly",
        src: "/mock/weekly-summary-reference.png",
        title: "Narrative direction",
        meta: "Current recap layout used to refine the DTR story.",
      },
      {
        id: "report",
        src: "/mock/final-report-reference.png",
        title: "Report destination",
        meta: "Keeps the weekly draft aligned with the final write-up.",
      },
    ],
    narrative: activeWeek.narrative,
    recapDays: activeWeek.recapDays,
  };
}
