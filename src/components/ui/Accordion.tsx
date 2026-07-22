import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { collapse } from '../../lib/motion'

export function Accordion({
  title,
  subtitle,
  defaultOpen = false,
  headerRight,
  children,
}: {
  title: ReactNode
  subtitle?: ReactNode
  defaultOpen?: boolean
  headerRight?: ReactNode
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const reduceMotion = useReducedMotion()

  return (
    <div className="border border-hairline rounded-xl bg-surface-card dark:bg-surface-dark-elevated dark:border-hairline-dark overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-sm px-lg py-base text-left active:bg-surface-strong dark:active:bg-white/5"
      >
        <div className="min-w-0">
          <div className="text-title-sm font-sans text-ink dark:text-on-dark truncate">{title}</div>
          {subtitle && <div className="text-body-sm text-muted dark:text-on-dark-soft truncate">{subtitle}</div>}
        </div>
        <div className="flex items-center gap-sm shrink-0">
          {headerRight}
          <ChevronDown
            size={18}
            className={`text-muted dark:text-on-dark-soft transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden"
            variants={reduceMotion ? undefined : collapse}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <div className="px-lg pb-lg border-t border-hairline dark:border-hairline-dark pt-base">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
