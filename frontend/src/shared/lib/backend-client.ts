import { LOGIN_ROUTE } from "@/shared/lib/routes";
import type {
  InternshipTermDTO,
  JournalEntryDTO,
  ProfileDTO,
  WorkDayDTO,
} from "@/shared/lib/backend-types";

import { getSupabaseBrowserClient } from "./supabase/browser-client";
import { getBackendApiBaseUrl } from "./supabase/env";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export async function fetchBackendJson<T>(path: string, init?: RequestInit): Promise<T> {
  const isMockUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("hzsfwurhaqfwuzcqmglw");
  const supabase = getSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token && !isMockUrl) {
    if (typeof window !== "undefined") {
      window.location.assign(LOGIN_ROUTE);
    }
    throw new Error("Missing authenticated session.");
  }

  const response = await fetch(`${getBackendApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      "Authorization": session?.access_token ? `Bearer ${session.access_token}` : "Bearer mock-token",
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 401 && !isMockUrl && typeof window !== "undefined") {
    window.location.assign(LOGIN_ROUTE);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function sendBackendJson<T>(
  path: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: JsonValue,
): Promise<T> {
  return fetchBackendJson<T>(path, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function fetchDashboardSlice(fromDate: string, toDate: string) {
  const [profile, internship, workDays] = await Promise.all([
    fetchBackendJson<ProfileDTO>("/me/profile"),
    fetchBackendJson<InternshipTermDTO>("/me/internship"),
    fetchBackendJson<WorkDayDTO[]>(
      `/work-days?from=${encodeURIComponent(fromDate)}&to=${encodeURIComponent(toDate)}`,
    ),
  ]);

  const entriesByDate = await Promise.all(
    workDays.map(async (workDay) => {
      const entries = await fetchBackendJson<JournalEntryDTO[]>(
        `/work-days/${workDay.work_date}/entries`,
      );
      return [workDay.work_date, entries] as const;
    }),
  );

  return {
    profile,
    internship,
    workDays,
    entriesByDate: Object.fromEntries(entriesByDate),
  };
}
