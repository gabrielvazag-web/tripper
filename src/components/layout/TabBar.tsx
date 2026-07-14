import { Home, Map, BookMarked, Wallet, MoreHorizontal } from 'lucide-react'
import type { TabKey } from '../../TripShell'

const TABS: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: 'inicio', label: 'Início', icon: Home },
  { key: 'roteiro', label: 'Roteiro', icon: Map },
  { key: 'reservas', label: 'Reservas', icon: BookMarked },
  { key: 'gastos', label: 'Gastos', icon: Wallet },
  { key: 'mais', label: 'Mais', icon: MoreHorizontal },
]

export function TabBar({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-canvas/95 dark:bg-surface-dark/95 backdrop-blur border-t border-hairline dark:border-hairline-dark safe-bottom">
      <div className="max-w-lg mx-auto grid grid-cols-5">
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="flex flex-col items-center justify-center gap-[2px] py-xs min-h-[56px] active:opacity-70"
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.25 : 1.75}
                className={isActive ? 'text-ink dark:text-white' : 'text-muted-soft'}
              />
              <span className={`text-[11px] leading-none ${isActive ? 'text-ink dark:text-white font-medium' : 'text-muted-soft'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
