export function DailyLogLoading() {
  return (
    <div className="space-y-6">
      <div className="paper-panel h-32 animate-pulse" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="paper-sheet h-[620px] animate-pulse" />
          <div className="paper-panel h-24 animate-pulse" />
        </div>
        <div className="paper-panel h-[420px] animate-pulse" />
      </div>
    </div>
  );
}
