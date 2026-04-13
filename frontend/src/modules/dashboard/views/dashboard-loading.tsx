export function DashboardLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_340px]">
      <div className="space-y-6">
        <div className="paper-panel h-44 animate-pulse" />
        <div className="paper-sheet h-[520px] animate-pulse" />
      </div>
      <div className="space-y-6">
        <div className="paper-panel h-[420px] animate-pulse" />
        <div className="paper-panel h-40 animate-pulse" />
      </div>
    </div>
  );
}
