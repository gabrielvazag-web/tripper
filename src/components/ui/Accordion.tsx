import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

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
      {open && <div className="px-lg pb-lg border-t border-hairline dark:border-hairline-dark pt-base">{children}</div>}
    </div>
  )
}
