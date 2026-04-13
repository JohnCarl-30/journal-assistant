"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchJson } from "@/shared/lib/fetch-json";

import { type EvaluationPrepData } from "../models/evaluation-prep";

export function useEvaluationPrepViewModel() {
  const query = useQuery({
    queryKey: ["evaluation-prep"],
    queryFn: () => fetchJson<EvaluationPrepData>("/api/evaluation-prep"),
  });

  return {
    evaluationPrep: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    retry: query.refetch,
  };
}
