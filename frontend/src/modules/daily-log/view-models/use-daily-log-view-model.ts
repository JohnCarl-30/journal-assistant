"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { JournalEntryDTO, WorkDayDTO } from "@/shared/lib/backend-types";
import { fetchBackendJson, sendBackendJson } from "@/shared/lib/backend-client";

import { buildDailyLogData, type DailyLogData } from "../models/daily-log";

type WorkDayUpdateInput = {
  time_in_local: string | null;
  time_out_local: string | null;
  timezone?: string;
};

type EntryCreateInput = {
  title: string;
  content_md: string;
};

type EntryUpdateInput = {
  title?: string;
  content_md?: string;
};

export function useDailyLogViewModel(date: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["daily-log", date],
    queryFn: async (): Promise<DailyLogData> => {
      const [workDay, entries] = await Promise.all([
        fetchBackendJson<WorkDayDTO>(`/work-days/${date}`),
        fetchBackendJson<JournalEntryDTO[]>(`/work-days/${date}/entries`),
      ]);

      return buildDailyLogData(date, { workDay, entries });
    },
  });

  async function invalidateDailyViews() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["daily-log", date] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
    ]);
  }

  const workDayMutation = useMutation({
    mutationFn: (payload: WorkDayUpdateInput) =>
      sendBackendJson<WorkDayDTO>(`/work-days/${date}`, "PUT", payload),
    onSuccess: () => invalidateDailyViews(),
  });

  const createEntryMutation = useMutation({
    mutationFn: (payload: EntryCreateInput) =>
      sendBackendJson<JournalEntryDTO>(`/work-days/${date}/entries`, "POST", payload),
    onSuccess: () => invalidateDailyViews(),
  });

  const updateEntryMutation = useMutation({
    mutationFn: ({ entryId, payload }: { entryId: string; payload: EntryUpdateInput }) =>
      sendBackendJson<JournalEntryDTO>(`/entries/${entryId}`, "PATCH", payload),
    onSuccess: () => invalidateDailyViews(),
  });

  const deleteEntryMutation = useMutation({
    mutationFn: (entryId: string) => sendBackendJson<void>(`/entries/${entryId}`, "DELETE"),
    onSuccess: () => invalidateDailyViews(),
  });

  return {
    dailyLog: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSaving:
      workDayMutation.isPending ||
      createEntryMutation.isPending ||
      updateEntryMutation.isPending ||
      deleteEntryMutation.isPending,
    retry: query.refetch,
    updateWorkDay: workDayMutation.mutateAsync,
    createEntry: createEntryMutation.mutateAsync,
    updateEntry: (entryId: string, payload: EntryUpdateInput) =>
      updateEntryMutation.mutateAsync({ entryId, payload }),
    deleteEntry: deleteEntryMutation.mutateAsync,
  };
}
