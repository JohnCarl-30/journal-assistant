import { DailyLogScreen } from "@/modules/daily-log/views/daily-log-screen";
import { EditorialShell } from "@/shared/components/layout/editorial-shell";
import { Badge } from "@/shared/components/ui/badge";

export default function DailyLogPage({
  params,
}: {
  params: {
    date: string;
  };
}) {
  return (
    <EditorialShell
      topBarLabel="Daily log workspace"
      topBarDescription="Capture today while the work, blockers, and proof points are still easy to recall."
      topBarActions={
        <Badge className="rounded-full border-[var(--border)] bg-white/85 px-3 py-1 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          Autosave on
        </Badge>
      }
    >
      <DailyLogScreen date={params.date} />
    </EditorialShell>
  );
}
