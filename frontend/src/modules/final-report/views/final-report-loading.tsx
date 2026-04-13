export function FinalReportLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_290px]">
      <div className="paper-panel h-[360px] animate-pulse" />
      <div className="paper-sheet h-[780px] animate-pulse" />
      <div className="paper-panel hidden h-[420px] animate-pulse xl:block" />
    </div>
  );
}
