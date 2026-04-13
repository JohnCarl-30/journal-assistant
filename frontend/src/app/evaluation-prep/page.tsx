import { EvaluationPrepScreen } from "@/modules/evaluation-prep/views/evaluation-prep-screen";
import { EditorialShell } from "@/shared/components/layout/editorial-shell";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

export default function EvaluationPrepPage() {
  return (
    <EditorialShell
      topBarLabel="Supervisor evaluation prep"
      topBarDescription="Turn recent summaries into confident talking points before the next review conversation."
      topBarActions={
        <>
          <Badge className="rounded-full border-[var(--border)] bg-white/85 px-3 py-1 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Talking points ready
          </Badge>
          <Button className="h-10 rounded-full bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--foreground)] hover:opacity-90">
            Refresh prep
          </Button>
        </>
      }
    >
      <EvaluationPrepScreen />
    </EditorialShell>
  );
}
