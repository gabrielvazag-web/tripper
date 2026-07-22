import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { backdrop, sheet } from '../../lib/motion'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function BottomSheet({ open, onClose, title, children }: Props) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.button
            aria-label="Fechar"
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            variants={backdrop}
            initial="hidden"
            animate="show"
            exit="hidden"
          />
          <motion.div
            className="relative z-10 w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-t-xxl bg-canvas-soft dark:bg-surface-dark-elevated safe-bottom"
            variants={reduceMotion ? backdrop : sheet}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <div className="sticky top-0 flex items-center justify-between px-lg py-base bg-canvas-soft dark:bg-surface-dark-elevated border-b border-hairline dark:border-hairline-dark rounded-t-xxl">
              <h2 className="text-title-md font-sans text-ink dark:text-on-dark">{title}</h2>
              <button
                aria-label="Fechar"
                onClick={onClose}
                className="p-xs rounded-full active:bg-surface-strong dark:active:bg-white/10"
              >
                <X size={20} className="text-ink dark:text-on-dark" />
              </button>
            </div>
            <div className="p-lg pb-xl">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
