import type { Reserva, TipoReserva } from '../../types/trip'
import { TIPO_ICON } from './tipoIcons'
import { TIPO_GRADIENT } from './tipoGradients'
import { TIPO_LABELS } from './tipoLabels'

export function ReservationTypeCard({ tipo, reservas, onOpen }: { tipo: TipoReserva; reservas: Reserva[]; onOpen: () => void }) {
  const Icon = TIPO_ICON[tipo]
  const { from, to } = TIPO_GRADIENT[tipo]
  const reservadas = reservas.filter((r) => r.status === 'reservado').length
  const aReservar = reservas.length - reservadas

  return (
    <button
      onClick={onOpen}
      className="rounded-xl h-36 p-base flex flex-col justify-between text-left active:scale-[0.98] transition-transform shadow-soft"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <div className="flex items-center gap-xs">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
          <Icon size={16} className="text-white" />
        </span>
        <span className="text-body-sm text-white/90 font-medium">{TIPO_LABELS[tipo]}</span>
      </div>

      <div className="flex items-end justify-between">
        <p className="text-display-sm text-white leading-none">
          {reservas.length}
          <span className="text-caption font-normal text-white/80"> {reservas.length > 1 ? 'reservas' : 'reserva'}</span>
        </p>
        <div className="text-right leading-tight">
          {reservadas > 0 && <p className="text-caption text-white/90">{reservadas} reservada{reservadas > 1 ? 's' : ''}</p>}
          {aReservar > 0 && <p className="text-caption text-white/70">{aReservar} a reservar</p>}
        </div>
      </div>
    </button>
  )
}
