import { FinalReportScreen } from "@/modules/final-report/views/final-report-screen";
import { EditorialShell } from "@/shared/components/layout/editorial-shell";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { reportPrintRoute } from "@/shared/lib/routes";
import Link from "next/link";

export default function ReportPage() {
  return (
    <EditorialShell
      topBarLabel="Final report builder"
      topBarDescription="Draft section by section, keep reference data nearby, and export when the document is clean."
      topBarActions={
        <>
          <Badge className="rounded-full border-[var(--border)] bg-white/85 px-3 py-1 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            1382 words
          </Badge>
          <Button
            asChild
            className="h-10 rounded-full bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--foreground)] hover:opacity-90"
          >
            <Link href={reportPrintRoute("doc-report-main")}>Export PDF</Link>
          </Button>
        </>
      }
    >
      <FinalReportScreen />
    </EditorialShell>
  );
}
