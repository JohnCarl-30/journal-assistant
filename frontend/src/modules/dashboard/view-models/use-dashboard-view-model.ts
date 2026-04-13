"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchDashboardSlice } from "@/shared/lib/backend-client";

import { buildDashboardData, type DashboardData } from "../models/dashboard";

export function useDashboardViewModel() {
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const toDate = new Date().toISOString().slice(0, 10);
      const fromDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 60)
        .toISOString()
        .slice(0, 10);

      const payload = await fetchDashboardSlice(fromDate, toDate);
      return buildDashboardData(payload);
    },
  });

  return {
    dashboard: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    retry: query.refetch,
  };
}
