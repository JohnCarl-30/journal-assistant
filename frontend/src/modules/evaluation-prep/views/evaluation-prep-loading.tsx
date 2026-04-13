export function EvaluationPrepLoading() {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="paper-sheet min-h-[640px] animate-pulse p-8" />
      <div className="paper-panel min-h-[420px] animate-pulse p-8" />
    </div>
  );
}
