import { DashboardScreen } from "@/modules/dashboard/views/dashboard-screen";
import { EditorialShell } from "@/shared/components/layout/editorial-shell";

export default function DashboardPage() {
  return (
    <EditorialShell
      topBarLabel="Spring internship · 2026"
      topBarDescription="Track hours, keep the journal current, and move the next document forward."
    >
      <DashboardScreen />
    </EditorialShell>
  );
}
