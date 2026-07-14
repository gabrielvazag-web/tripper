import { ChevronRight } from 'lucide-react'
import type { Trecho } from '../../lib/itineraryGroups'
import { Chip } from '../../components/ui/Chip'
import { RegionCover } from './RegionCover'
import { formatDateBR } from '../../lib/date'

export function TrechoCard({ trecho, isAtual, onOpen }: { trecho: Trecho; isAtual: boolean; onOpen: () => void }) {
  const temReservado = trecho.dias.some((d) => d.reservado)
  const periodo =
    trecho.dataInicio === trecho.dataFim
      ? formatDateBR(trecho.dataInicio)
      : `${formatDateBR(trecho.dataInicio)} – ${formatDateBR(trecho.dataFim)}`

  return (
    <button
      onClick={onOpen}
      className={`w-full text-left rounded-xl overflow-hidden border bg-surface-card dark:bg-surface-dark-elevated active:opacity-90 transition-opacity ${
        isAtual ? 'border-ink dark:border-white' : 'border-hairline dark:border-hairline-dark'
      }`}
    >
      <RegionCover base={trecho.base} className="h-28 flex items-center justify-center" />
      <div className="flex items-center gap-sm p-base">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-xs flex-wrap mb-xxs">
            {isAtual && <Chip tone="neutral">Agora</Chip>}
            {temReservado && <Chip tone="success">Reservado</Chip>}
            <span className="text-caption text-muted dark:text-on-dark-soft">
              {trecho.dias.length} dia{trecho.dias.length > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-title-md font-sans text-ink dark:text-on-dark truncate">{trecho.base}</p>
          <p className="text-body-sm text-muted dark:text-on-dark-soft">{periodo}</p>
        </div>
        <ChevronRight size={18} className="shrink-0 text-muted-soft" />
      </div>
    </button>
  )
}
