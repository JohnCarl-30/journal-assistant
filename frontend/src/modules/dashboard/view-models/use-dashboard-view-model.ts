"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchJson } from "@/shared/lib/fetch-json";

import { type DashboardData } from "../models/dashboard";

export function useDashboardViewModel() {
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchJson<DashboardData>("/api/dashboard"),
  });

  return {
    dashboard: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    retry: query.refetch,
  };
}
