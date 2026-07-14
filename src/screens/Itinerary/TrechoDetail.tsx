import { Plus, Trash2 } from 'lucide-react'
import type { DiaRoteiro } from '../../types/trip'
import type { Trecho } from '../../lib/itineraryGroups'
import { RegionCover } from './RegionCover'
import { DayCard } from './DayCard'
import { diffInDays, formatDateBR, parseISODate, todayAtMidnight } from '../../lib/date'

export function TrechoDetail({
  trecho,
  itinerarioCompleto,
  onEditDia,
  onAddDia,
  onMove,
  onDeleteParada,
}: {
  trecho: Trecho
  itinerarioCompleto: DiaRoteiro[]
  onEditDia: (dia: DiaRoteiro) => void
  onAddDia: () => void
  onMove: (id: string, direction: 'up' | 'down') => void
  onDeleteParada: () => void
}) {
  const today = todayAtMidnight()
  const periodo =
    trecho.dataInicio === trecho.dataFim
      ? formatDateBR(trecho.dataInicio)
      : `${formatDateBR(trecho.dataInicio)} – ${formatDateBR(trecho.dataFim)}`

  return (
    <div className="px-lg py-base flex flex-col gap-base">
      <div className="relative rounded-xxl overflow-hidden h-32">
        <RegionCover base={trecho.base} className="absolute inset-0 flex items-center justify-center" iconSize={56} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-base">
          <p className="text-title-md font-semibold text-white">{trecho.base}</p>
          <p className="text-body-sm text-white/85">{periodo}</p>
        </div>
      </div>

      <div className="flex flex-col gap-sm">
        {trecho.dias.map((dia) => {
          const globalIndex = itinerarioCompleto.findIndex((d) => d.id === dia.id)
          return (
            <DayCard
              key={dia.id}
              dia={dia}
              isToday={diffInDays(parseISODate(dia.data), today) === 0}
              canMoveUp={globalIndex > 0}
              canMoveDown={globalIndex < itinerarioCompleto.length - 1}
              onMove={(direction) => onMove(dia.id, direction)}
              onEdit={() => onEditDia(dia)}
            />
          )
        })}

        <button
          onClick={onAddDia}
          className="flex items-center justify-center gap-xs h-12 rounded-xl border border-dashed border-hairline-strong dark:border-hairline-dark-strong text-body-md text-muted dark:text-on-dark-soft active:bg-surface-strong dark:active:bg-white/5"
        >
          <Plus size={18} /> Adicionar dia em {trecho.base}
        </button>

        <button
          onClick={onDeleteParada}
          className="flex items-center justify-center gap-xs h-12 rounded-xl text-body-md text-error active:bg-error/10"
        >
          <Trash2 size={16} /> Excluir parada inteira
        </button>
      </div>
    </div>
  )
}
