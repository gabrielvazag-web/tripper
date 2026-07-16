import { ChevronRight, ListChecks, NotebookPen, Settings, ShieldCheck, Sparkles } from 'lucide-react'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { Card } from '../../components/ui/Card'
import type { MoreKey } from '../../TripShell'

const ITEMS: { key: MoreKey; label: string; icon: typeof Settings }[] = [
  { key: 'seguro', label: 'Seguro viagem', icon: ShieldCheck },
  { key: 'checklists', label: 'Checklists', icon: ListChecks },
  { key: 'notas', label: 'Caderneta', icon: NotebookPen },
  { key: 'dicas', label: 'Dicas', icon: Sparkles },
  { key: 'config', label: 'Configurações', icon: Settings },
]

export function MoreScreen({ onNavigate }: { onNavigate: (page: MoreKey) => void }) {
  return (
    <div>
      <ScreenHeader title="Mais" />
      <div className="px-lg py-base">
        <Card padded={false} className="overflow-hidden">
          {ITEMS.map(({ key, label, icon: Icon }, i) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`w-full flex items-center gap-sm px-lg py-base text-left active:bg-surface-strong dark:active:bg-white/5 ${
                i > 0 ? 'border-t border-hairline dark:border-hairline-dark' : ''
              }`}
            >
              <Icon size={20} className="text-ink dark:text-on-dark" />
              <span className="flex-1 text-body-md text-ink dark:text-on-dark">{label}</span>
              <ChevronRight size={18} className="text-muted-soft" />
            </button>
          ))}
        </Card>
      </div>
    </div>
  )
}
