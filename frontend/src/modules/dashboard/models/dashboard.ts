export type DashboardActivity = {
  id: string;
  dayLabel: string;
  dateLabel: string;
  title: string;
  summary: string;
  hours: string;
  tags: string[];
};

export type DashboardData = {
  today: {
    dateLabel: string;
    streak: number;
    hoursLogged: string;
    note: string;
  };
  sourceBoard: Array<{
    id: string;
    src: string;
    title: string;
    meta: string;
  }>;
  progress: {
    completedHours: number;
    targetHours: number;
    weeklyAverage: string;
    totalLogs: number;
    hoursRemaining: number;
    daysRemaining: number;
    missingLogs: number;
    nextDocument: string;
  };
  recentActivity: DashboardActivity[];
};

const dashboardData: DashboardData = {
  today: {
    dateLabel: "Thursday, Apr 2",
    streak: 4,
    hoursLogged: "6.5 hrs",
    note: "You are on track to close this week cleanly if you capture one more log before Friday.",
  },
  sourceBoard: [
    {
      id: "daily-log",
      src: "/mock/daily-log-reference.png",
      title: "Daily writing desk",
      meta: "Guided prompts and evidence collection for the current workday.",
    },
    {
      id: "weekly-summary",
      src: "/mock/weekly-summary-reference.png",
      title: "Weekly narrative draft",
      meta: "Used to keep the summary clean before it flows into the final report.",
    },
    {
      id: "final-report",
      src: "/mock/final-report-reference.png",
      title: "Report canvas",
      meta: "The document destination that this week’s edits are preparing.",
    },
  ],
  progress: {
    completedHours: 142,
    targetHours: 300,
    weeklyAverage: "24.5 hrs",
    totalLogs: 32,
    hoursRemaining: 158,
    daysRemaining: 54,
    missingLogs: 2,
    nextDocument: "Week 5 summary draft",
  },
  recentActivity: [
    {
      id: "today",
      dayLabel: "Today",
      dateLabel: "Apr 2",
      title: "Reshaped the weekly summary into a calmer editorial workspace",
      summary:
        "Reworked the archive rail, strengthened the DTR narrative hierarchy, and replaced the faded floating cards with a cleaner daily story layout.",
      hours: "6.5 hrs",
      tags: ["Weekly summary", "UI polish"],
    },
    {
      id: "yesterday",
      dayLabel: "Yesterday",
      dateLabel: "Apr 1",
      title: "Built the report canvas and reference data panel",
      summary:
        "Introduced a print-aware paper canvas, grouped the side reference data by type, and tightened the writing surface so it reads like a document, not a dashboard.",
      hours: "8 hrs",
      tags: ["Final report", "Writing flow"],
    },
    {
      id: "march-31",
      dayLabel: "Tuesday",
      dateLabel: "Mar 31",
      title: "Mapped the daily log into a writing desk layout",
      summary:
        "Moved evidence into a lighter attachment tray, added AI helper actions below the editor, and split the journal prompts into clearer guided sections.",
      hours: "7.5 hrs",
      tags: ["Daily log", "Interaction design"],
    },
  ],
};

export function getDashboardData() {
  return dashboardData;
}
