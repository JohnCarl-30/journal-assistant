import type {
  InternshipTermDTO,
  JournalEntryDTO,
  ProfileDTO,
  WorkDayDTO,
} from "@/shared/lib/backend-types";

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

type DashboardSlice = {
  profile: ProfileDTO;
  internship: InternshipTermDTO;
  workDays: WorkDayDTO[];
  entriesByDate: Record<string, JournalEntryDTO[]>;
};

const sourceBoard: DashboardData["sourceBoard"] = [
  {
    id: "daily-log",
    src: "/mock/daily-log-reference.png",
    title: "Daily writing desk",
    meta: "Capture multiple focused entries each day, then reuse them later in summaries and reports.",
  },
  {
    id: "weekly-summary",
    src: "/mock/weekly-summary-reference.png",
    title: "Weekly narrative draft",
    meta: "The next recap stays grounded in the real work already logged on the backend.",
  },
  {
    id: "final-report",
    src: "/mock/final-report-reference.png",
    title: "Report canvas",
    meta: "Today’s entries can flow into the final report once the generation layer is wired later.",
  },
];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatHours(minutes: number) {
  const hours = minutes / 60;
  return `${Number.isInteger(hours) ? hours.toFixed(0) : hours.toFixed(1)} hrs`;
}

function mondayKey(isoDate: string) {
  const date = new Date(`${isoDate}T12:00:00`);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date.toISOString().slice(0, 10);
}

function computeWeeklyAverage(workDays: WorkDayDTO[]) {
  if (workDays.length === 0) {
    return "0 hrs";
  }

  const totalMinutes = workDays.reduce((sum, workDay) => sum + workDay.total_minutes, 0);
  const weeks = new Set(workDays.map((workDay) => mondayKey(workDay.work_date))).size || 1;
  return formatHours(Math.round(totalMinutes / weeks));
}

function computeStreak(workDays: WorkDayDTO[]) {
  const datesWithEntries = workDays
    .filter((workDay) => workDay.entry_ids.length > 0)
    .map((workDay) => workDay.work_date)
    .sort()
    .reverse();

  if (datesWithEntries.length === 0) {
    return 0;
  }

  let streak = 0;
  let cursor = startOfDay(new Date(`${datesWithEntries[0]}T12:00:00`));

  for (const isoDate of datesWithEntries) {
    const current = startOfDay(new Date(`${isoDate}T12:00:00`));
    const diffDays = Math.round((cursor.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      streak += 1;
      cursor = new Date(current);
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    if (diffDays > 0) {
      break;
    }
  }

  return streak;
}

function computeMissingLogs(workDays: WorkDayDTO[]) {
  const workDaySet = new Set(workDays.map((workDay) => workDay.work_date));
  let missing = 0;
  const today = startOfDay(new Date());

  for (let offset = 0; offset < 5; offset += 1) {
    const candidate = new Date(today);
    candidate.setDate(today.getDate() - offset);
    const dayOfWeek = candidate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }
    const isoDate = candidate.toISOString().slice(0, 10);
    if (!workDaySet.has(isoDate)) {
      missing += 1;
    }
  }

  return missing;
}

function relativeDayLabel(entryDate: Date, today: Date) {
  const diffDays = Math.round(
    (startOfDay(today).getTime() - startOfDay(entryDate).getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) {
    return "Today";
  }
  if (diffDays === 1) {
    return "Yesterday";
  }
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(entryDate);
}

export function buildDashboardData({
  profile,
  internship,
  workDays,
  entriesByDate,
}: DashboardSlice): DashboardData {
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);
  const todayWorkDay = workDays.find((workDay) => workDay.work_date === todayIso);
  const totalMinutes = workDays.reduce((sum, workDay) => sum + workDay.total_minutes, 0);
  const targetHours = internship.target_hours;
  const completedHours = Math.round(totalMinutes / 60);
  const endDate = new Date(`${internship.end_date}T12:00:00`);
  const daysRemaining = Math.max(
    0,
    Math.ceil((startOfDay(endDate).getTime() - startOfDay(today).getTime()) / (1000 * 60 * 60 * 24)),
  );
  const allEntries = Object.entries(entriesByDate)
    .flatMap(([workDate, entries]) =>
      entries.map((entry) => ({
        ...entry,
        workDate,
        workDay: workDays.find((day) => day.work_date === workDate),
      })),
    )
    .sort((left, right) => right.updated_at.localeCompare(left.updated_at));

  return {
    today: {
      dateLabel: formatDateLabel(today),
      streak: computeStreak(workDays),
      hoursLogged: formatHours(todayWorkDay?.total_minutes ?? 0),
      note:
        allEntries.length > 0
          ? `Welcome back, ${profile.name.split(" ")[0]}. Your journal is live on the backend now, so today's work will persist across reloads.`
          : "Start with one focused entry for today, then add more as the work changes shape.",
    },
    sourceBoard,
    progress: {
      completedHours,
      targetHours,
      weeklyAverage: computeWeeklyAverage(workDays),
      totalLogs: allEntries.length,
      hoursRemaining: Math.max(0, targetHours - completedHours),
      daysRemaining,
      missingLogs: computeMissingLogs(workDays),
      nextDocument:
        computeMissingLogs(workDays) > 0
          ? "Close missing daily logs"
          : "Refresh the current weekly summary",
    },
    recentActivity: allEntries.slice(0, 3).map((entry) => {
      const entryDate = new Date(`${entry.workDate}T12:00:00`);
      return {
        id: entry.id,
        dayLabel: relativeDayLabel(entryDate, today),
        dateLabel: formatShortDate(entryDate),
        title: entry.title,
        summary: entry.content_md,
        hours: formatHours(entry.workDay?.total_minutes ?? 0),
        tags: ["Daily log", internship.role_title],
      };
    }),
  };
}
