import { useState } from 'react'
import { Check, Copy, Pencil } from 'lucide-react'
import type { Reserva } from '../../types/trip'
import { Card } from '../../components/ui/Card'
import { StatusChip } from '../../components/ui/Chip'
import { MapLink } from '../../components/ui/MapLink'
import { AttachmentField } from '../../components/ui/AttachmentField'
import { formatDateBR } from '../../lib/date'
import { formatMoeda } from '../../lib/money'
import { TIPO_BADGE_BG, TIPO_ICON } from './tipoIcons'

export function ReservationCard({
  reserva,
  onEdit,
  onAttach,
}: {
  reserva: Reserva
  onEdit: () => void
  onAttach: (imageId: string | undefined) => void
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!reserva.confirmacao) return
    try {
      await navigator.clipboard.writeText(reserva.confirmacao)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard indisponível — ignora
    }
  }

  const datas =
    reserva.tipo === 'voo'
      ? [reserva.checkin && formatDateBR(reserva.checkin), reserva.horario].filter(Boolean).join(' · ')
      : [reserva.checkin && formatDateBR(reserva.checkin), reserva.checkout && formatDateBR(reserva.checkout)].filter(Boolean).join(' → ')

  const Icon = TIPO_ICON[reserva.tipo]

  return (
    <Card>
      <div className="flex items-start justify-between gap-sm">
        <div className="flex items-start gap-sm min-w-0">
          <span className={`shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full ${TIPO_BADGE_BG[reserva.tipo]}`}>
            <Icon size={17} className="text-ink" />
          </span>
          <div className="min-w-0">
            <div className="text-title-sm font-sans text-ink dark:text-on-dark truncate">{reserva.nome}</div>
            {reserva.local && <div className="text-body-sm text-muted dark:text-on-dark-soft truncate">{reserva.local}</div>}
          </div>
        </div>
        <StatusChip status={reserva.status} />
      </div>

      {datas && <div className="mt-sm text-body-sm text-body dark:text-on-dark-soft">{datas}</div>}

      {reserva.confirmacao && (
        <button onClick={handleCopy} className="mt-sm flex items-center gap-xs text-body-sm text-ink dark:text-on-dark active:opacity-70">
          <span className="font-medium">Confirmação:</span> {reserva.confirmacao}
          {copied ? <Check size={14} className="text-success" /> : <Copy size={14} className="text-muted-soft" />}
        </button>
      )}

      {reserva.valor !== undefined && (
        <div className="mt-sm text-body-sm text-ink dark:text-on-dark">
          {formatMoeda(reserva.valor, reserva.moeda ?? 'BRL')}
          {reserva.pagoPor && <span className="text-muted dark:text-on-dark-soft"> · pago por {reserva.pagoPor}</span>}
        </div>
      )}

      {reserva.notas && <p className="mt-sm text-body-sm text-body dark:text-on-dark-soft">{reserva.notas}</p>}

      <div className="mt-base">
        <AttachmentField imageId={reserva.imagemId} onChange={onAttach} />
      </div>

      <div className="mt-base flex items-center gap-lg">
        <button onClick={onEdit} className="inline-flex items-center gap-xxs text-body-sm text-ink dark:text-on-dark active:opacity-70">
          <Pencil size={14} /> Editar
        </button>
        {(reserva.local || reserva.nome) && <MapLink query={reserva.local || reserva.nome} />}
      </div>
    </Card>
  )
}
