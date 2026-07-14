import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'

export function ScreenHeader({
  title,
  onBack,
  right,
}: {
  title: string
  onBack?: () => void
  right?: ReactNode
}) {
  return (
    <header className="sticky top-0 z-30 bg-canvas/95 dark:bg-surface-dark/95 backdrop-blur safe-top border-b border-hairline dark:border-hairline-dark">
      <div className="max-w-lg mx-auto flex items-center gap-sm px-lg h-14">
        {onBack && (
          <button onClick={onBack} className="-ml-xs p-xs rounded-full active:bg-surface-strong dark:active:bg-white/10" aria-label="Voltar">
            <ChevronLeft size={22} className="text-ink dark:text-on-dark" />
          </button>
        )}
        <h1 className="flex-1 text-title-md font-sans text-ink dark:text-on-dark truncate">{title}</h1>
        {right}
      </div>
    </header>
  )
}
