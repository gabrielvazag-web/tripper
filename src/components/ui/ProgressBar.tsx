export function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="flex items-center gap-sm">
      <div className="flex-1 h-2 rounded-pill bg-surface-strong dark:bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-pill bg-success transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-caption text-muted dark:text-on-dark-soft shrink-0">
        {value}/{total}
      </span>
    </div>
  )
}
