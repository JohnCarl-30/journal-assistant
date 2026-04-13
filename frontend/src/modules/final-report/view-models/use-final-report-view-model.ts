"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchJson } from "@/shared/lib/fetch-json";

import { type FinalReportData } from "../models/final-report";

export function useFinalReportViewModel() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["final-report"],
    queryFn: () => fetchJson<FinalReportData>("/api/report"),
  });

  async function copyReferenceValue(id: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1500);
  }

  return {
    report: query.data,
    copiedId,
    isLoading: query.isLoading,
    isError: query.isError,
    retry: query.refetch,
    copyReferenceValue,
  };
}
