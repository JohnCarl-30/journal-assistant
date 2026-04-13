"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchJson } from "@/shared/lib/fetch-json";

import { type DailyLogData } from "../models/daily-log";

export function useDailyLogViewModel(date: string) {
  const query = useQuery({
    queryKey: ["daily-log", date],
    queryFn: () => fetchJson<DailyLogData>(`/api/journal/${date}`),
  });

  return {
    dailyLog: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    retry: query.refetch,
  };
}
