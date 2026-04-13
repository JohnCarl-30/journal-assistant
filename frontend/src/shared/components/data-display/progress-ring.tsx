type ProgressRingProps = {
  value: number;
  total: number;
};

export function ProgressRing({ value, total }: ProgressRingProps) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const progress = total === 0 ? 0 : Math.min(value / total, 1);
  const dashOffset = circumference - circumference * progress;
  const percentage = Math.round(progress * 100);

  return (
    <div className="relative mx-auto flex size-[168px] items-center justify-center">
      <svg viewBox="0 0 160 160" className="size-full -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="rgba(24, 51, 45, 0.08)"
          strokeWidth="10"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeWidth="10"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-4xl text-foreground">{value}</span>
        <span className="mt-1 text-sm text-muted-foreground">{total} hrs target</span>
        <span className="mt-2 rounded-full border border-[var(--border)] bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {percentage}% logged
        </span>
      </div>
    </div>
  );
}
