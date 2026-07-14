import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function BottomSheet({ open, onClose, title, children }: Props) {
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

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        aria-label="Fechar"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-t-xxl bg-canvas-soft dark:bg-surface-dark-elevated safe-bottom animate-[slideUp_0.2s_ease-out]">
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
      </div>
    </div>,
    document.body,
  )
}
