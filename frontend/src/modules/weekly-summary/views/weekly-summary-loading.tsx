export function WeeklySummaryLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="paper-panel h-[320px] animate-pulse" />
      <div className="space-y-6">
        <div className="paper-panel h-36 animate-pulse" />
        <div className="paper-sheet h-72 animate-pulse" />
        <div className="paper-sheet h-[420px] animate-pulse" />
      </div>
    </div>
  );
}
