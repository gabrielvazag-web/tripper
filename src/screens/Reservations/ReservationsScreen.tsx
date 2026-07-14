import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTrip } from '../../store/TripContext'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { ReservationCard } from './ReservationCard'
import { ReservationTypeCard } from './ReservationTypeCard'
import { ReservationEditorSheet } from './ReservationEditorSheet'
import { TIPO_LABELS, TIPO_ORDER } from './tipoLabels'
import type { Pessoa, Reserva, TipoReserva } from '../../types/trip'

export function ReservationsScreen() {
  const { trip, dispatch } = useTrip()
  const pessoas = trip.meta.viajantes as Pessoa[]
  const [editing, setEditing] = useState<Reserva | undefined>(undefined)
  const [pendingDefaultTipo, setPendingDefaultTipo] = useState<TipoReserva | undefined>(undefined)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [tipoAberto, setTipoAberto] = useState<TipoReserva | null>(null)

  function openNew(defaultTipo?: TipoReserva) {
    setEditing(undefined)
    setPendingDefaultTipo(defaultTipo)
    setSheetOpen(true)
  }

  function openEdit(r: Reserva) {
    setEditing(r)
    setPendingDefaultTipo(undefined)
    setSheetOpen(true)
  }

  function handleSave(patch: Omit<Reserva, 'id'>) {
    if (editing) {
      dispatch({ type: 'reservas/update', id: editing.id, patch })
    } else {
      dispatch({ type: 'reservas/add', reserva: patch })
    }
  }

  function handleDelete() {
    if (editing) {
      dispatch({ type: 'reservas/remove', id: editing.id })
      setSheetOpen(false)
    }
  }

  const grupos = TIPO_ORDER.map((tipo) => ({
    tipo,
    reservas: trip.reservas.filter((r) => r.tipo === tipo),
  })).filter((g) => g.reservas.length > 0)

  const grupoAberto = grupos.find((g) => g.tipo === tipoAberto) ?? null

  return (
    <div>
      {grupoAberto ? (
        <>
          <ScreenHeader title={TIPO_LABELS[grupoAberto.tipo]} onBack={() => setTipoAberto(null)} />
          <div className="px-lg py-base flex flex-col gap-sm">
            {grupoAberto.reservas.map((r) => (
              <ReservationCard
                key={r.id}
                reserva={r}
                onEdit={() => openEdit(r)}
                onAttach={(imagemId) => dispatch({ type: 'reservas/update', id: r.id, patch: { imagemId } })}
              />
            ))}
            <button
              onClick={() => openNew(grupoAberto.tipo)}
              className="flex items-center justify-center gap-xs h-12 rounded-xl border border-dashed border-hairline-strong dark:border-hairline-dark-strong text-body-md text-muted dark:text-on-dark-soft active:bg-surface-strong dark:active:bg-white/5"
            >
              <Plus size={18} /> Adicionar {TIPO_LABELS[grupoAberto.tipo].toLowerCase()}
            </button>
          </div>
        </>
      ) : (
        <>
          <ScreenHeader
            title="Reservas"
            right={
              <button onClick={() => openNew()} className="inline-flex items-center gap-xxs text-body-sm text-ink dark:text-on-dark active:opacity-70">
                <Plus size={16} /> Nova
              </button>
            }
          />

          <div className="px-lg py-base">
            {grupos.length === 0 && (
              <p className="text-body-sm text-muted dark:text-on-dark-soft text-center py-xl">Nenhuma reserva cadastrada ainda.</p>
            )}

            <div className="grid grid-cols-2 gap-sm">
              {grupos.map(({ tipo, reservas }) => (
                <ReservationTypeCard key={tipo} tipo={tipo} reservas={reservas} onOpen={() => setTipoAberto(tipo)} />
              ))}
            </div>
          </div>
        </>
      )}

      <ReservationEditorSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        reserva={editing}
        defaultTipo={pendingDefaultTipo}
        pessoas={pessoas}
        onSave={handleSave}
        onDelete={editing ? handleDelete : undefined}
      />
    </div>
  )
}
