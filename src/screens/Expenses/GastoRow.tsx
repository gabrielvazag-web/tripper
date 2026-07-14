import type { Gasto } from '../../types/trip'
import { Avatar } from '../../components/ui/Avatar'
import { Chip } from '../../components/ui/Chip'
import { formatDateBR } from '../../lib/date'
import { formatMoeda } from '../../lib/money'
import { isGastoDeReserva } from '../../lib/reservaGastos'

export function GastoRow({ gasto, onEdit }: { gasto: Gasto; onEdit: () => void }) {
  const deReserva = isGastoDeReserva(gasto.id)

  const conteudo = (
    <>
      <Avatar name={gasto.pagoPor} size={32} />
      <div className="flex-1 min-w-0">
        <p className="text-body-md text-ink dark:text-on-dark truncate">{gasto.descricao}</p>
        <p className="text-caption text-muted dark:text-on-dark-soft">
          {gasto.categoria}
          {gasto.data && ` · ${formatDateBR(gasto.data)}`}
        </p>
      </div>
      {deReserva && <Chip tone="neutral">Reserva</Chip>}
      <p className="shrink-0 text-body-strong text-ink dark:text-on-dark">{formatMoeda(gasto.valor, gasto.moeda)}</p>
    </>
  )

  if (deReserva) {
    return <div className="w-full flex items-center gap-sm py-sm">{conteudo}</div>
  }

  return (
    <button onClick={onEdit} className="w-full flex items-center gap-sm py-sm text-left active:opacity-70">
      {conteudo}
    </button>
  )
}
