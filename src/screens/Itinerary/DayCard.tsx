import { ChevronDown, ChevronUp, Pencil } from 'lucide-react'
import { useState } from 'react'
import type { DiaRoteiro } from '../../types/trip'
import { Chip } from '../../components/ui/Chip'
import { MapLink } from '../../components/ui/MapLink'
import { formatDateBR } from '../../lib/date'

export function DayCard({
  dia,
  isToday,
  canMoveUp,
  canMoveDown,
  onMove,
  onEdit,
}: {
  dia: DiaRoteiro
  isToday: boolean
  canMoveUp: boolean
  canMoveDown: boolean
  onMove: (direction: 'up' | 'down') => void
  onEdit: () => void
}) {
  const [open, setOpen] = useState(isToday)

  return (
    <div
      className={`rounded-xl border bg-surface-card dark:bg-surface-dark-elevated overflow-hidden ${
        isToday ? 'border-ink dark:border-white' : 'border-hairline dark:border-hairline-dark'
      }`}
    >
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-start gap-sm px-lg py-base text-left active:bg-surface-strong dark:active:bg-white/5">
        <div className="shrink-0 w-12 text-center">
          <div className="text-caption-upper text-muted dark:text-on-dark-soft">{dia.diaSemana}</div>
          <div className="text-title-md font-sans text-ink dark:text-on-dark leading-none">{formatDateBR(dia.data).split(' de ')[0]}</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-xs flex-wrap">
            {isToday && <Chip tone="neutral">Hoje</Chip>}
            {dia.reservado && <Chip tone="success">Reservado</Chip>}
            <span className="text-caption text-muted dark:text-on-dark-soft">{dia.base}</span>
          </div>
          <div className="text-title-sm font-sans text-ink dark:text-on-dark truncate">{dia.titulo}</div>
          <div className="text-body-sm text-body dark:text-on-dark-soft truncate">{dia.descricao}</div>
        </div>
        <ChevronDown size={18} className={`shrink-0 mt-xs text-muted dark:text-on-dark-soft transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-lg pb-base border-t border-hairline dark:border-hairline-dark pt-base">
          {dia.itens && dia.itens.length > 0 && (
            <ul className="flex flex-col gap-xxs mb-base">
              {dia.itens.map((item, i) => (
                <li key={i} className="flex gap-sm text-body-md text-ink dark:text-on-dark">
                  <span className="text-muted-soft">•</span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center gap-sm mb-base">
            <MapLink query={`${dia.titulo}, ${dia.base}`} />
          </div>

          <div className="flex items-center gap-sm">
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-xxs text-body-sm text-ink dark:text-on-dark active:opacity-70"
            >
              <Pencil size={14} /> Editar
            </button>
            <div className="flex-1" />
            <button
              disabled={!canMoveUp}
              onClick={() => onMove('up')}
              className="p-xs rounded-full border border-hairline-strong dark:border-hairline-dark-strong disabled:opacity-30 active:bg-surface-strong dark:active:bg-white/10"
              aria-label="Mover pra cima"
            >
              <ChevronUp size={16} className="text-ink dark:text-on-dark" />
            </button>
            <button
              disabled={!canMoveDown}
              onClick={() => onMove('down')}
              className="p-xs rounded-full border border-hairline-strong dark:border-hairline-dark-strong disabled:opacity-30 active:bg-surface-strong dark:active:bg-white/10"
              aria-label="Mover pra baixo"
            >
              <ChevronDown size={16} className="text-ink dark:text-on-dark" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
