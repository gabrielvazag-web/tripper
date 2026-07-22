import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { popIn, tap, spring } from '../../lib/motion'

export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onChange}
      className="w-full flex items-center gap-sm py-sm text-left"
      whileTap={reduceMotion ? undefined : tap}
      transition={spring.snappy}
    >
      <span
        className={`shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
          checked
            ? 'bg-success border-success'
            : 'bg-transparent border-hairline-strong dark:border-hairline-dark-strong'
        }`}
      >
        <AnimatePresence>
          {checked && (
            <motion.span
              variants={reduceMotion ? undefined : popIn}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <Check size={16} className="text-white" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span
        className={`text-body-md transition-colors ${
          checked ? 'line-through text-muted-soft' : 'text-ink dark:text-on-dark'
        }`}
      >
        {label}
      </span>
    </motion.button>
  )
}
