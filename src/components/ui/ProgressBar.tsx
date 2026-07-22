import { motion, useReducedMotion } from 'framer-motion'
import { duration, ease } from '../../lib/motion'

export function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  const reduceMotion = useReducedMotion()

  return (
    <div className="flex items-center gap-sm">
      <div className="flex-1 h-2 rounded-pill bg-surface-strong dark:bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-pill bg-success"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={reduceMotion ? { duration: 0 } : { duration: duration.slow, ease: ease.out }}
        />
      </div>
      <span className="text-caption text-muted dark:text-on-dark-soft shrink-0">
        {value}/{total}
      </span>
    </div>
  )
}
