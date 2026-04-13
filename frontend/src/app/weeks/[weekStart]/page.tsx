import { WeeklySummaryScreen } from "@/modules/weekly-summary/views/weekly-summary-screen";
import { EditorialShell } from "@/shared/components/layout/editorial-shell";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

export default function WeeklySummaryPage({
  params,
}: {
  params: {
    weekStart: string;
  };
}) {
  return (
    <EditorialShell
      topBarLabel="Weekly recap"
      topBarDescription="Review the source entries, refine the narrative, and keep the week export-ready."
      topBarActions={
        <>
          <Badge className="rounded-full border-[var(--border)] bg-white/85 px-3 py-1 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Live draft
          </Badge>
          <Button className="h-10 rounded-full bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--foreground)] hover:opacity-90">
            Refresh summary
          </Button>
        </>
      }
    >
      <WeeklySummaryScreen weekStart={params.weekStart} />
    </EditorialShell>
  );
}
