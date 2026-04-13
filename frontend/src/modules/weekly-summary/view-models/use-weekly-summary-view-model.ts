"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchJson } from "@/shared/lib/fetch-json";

import { type WeeklySummaryData } from "../models/weekly-summary";

export function useWeeklySummaryViewModel(weekStart: string) {
  const query = useQuery({
    queryKey: ["weekly-summary", weekStart],
    queryFn: () => fetchJson<WeeklySummaryData>(`/api/weeks/${weekStart}`),
  });

  return {
    weeklySummary: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    retry: query.refetch,
  };
}
