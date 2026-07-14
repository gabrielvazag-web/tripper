import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTrip } from '../../store/TripContext'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { TrechoCard } from './TrechoCard'
import { TrechoDetail } from './TrechoDetail'
import { DayEditorSheet } from './DayEditorSheet'
import { NovaParadaSheet } from './NovaParadaSheet'
import type { DiaRoteiro } from '../../types/trip'
import { agruparPorTrecho } from '../../lib/itineraryGroups'
import { diffInDays, parseISODate, todayAtMidnight } from '../../lib/date'

export function ItineraryScreen() {
  const { trip, dispatch } = useTrip()
  const [editingDia, setEditingDia] = useState<DiaRoteiro | undefined>(undefined)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetDefaultBase, setSheetDefaultBase] = useState<string | undefined>(undefined)
  const [novaParadaOpen, setNovaParadaOpen] = useState(false)
  const [openTrechoKey, setOpenTrechoKey] = useState<string | null>(null)

  const today = todayAtMidnight()
  const trechos = agruparPorTrecho(trip.itinerario)
  const trechoAberto = trechos.find((t) => t.key === openTrechoKey) ?? null

  function openNewDia(defaultBase?: string) {
    setEditingDia(undefined)
    setSheetDefaultBase(defaultBase)
    setSheetOpen(true)
  }

  function openEdit(dia: DiaRoteiro) {
    setEditingDia(dia)
    setSheetDefaultBase(undefined)
    setSheetOpen(true)
  }

  function handleSave(patch: Omit<DiaRoteiro, 'id'>) {
    if (editingDia) {
      dispatch({ type: 'itinerario/update', id: editingDia.id, patch })
    } else {
      dispatch({ type: 'itinerario/add', dia: patch })
    }
  }

  function handleDelete() {
    if (editingDia) {
      dispatch({ type: 'itinerario/remove', id: editingDia.id })
      setSheetOpen(false)
    }
  }

  function handleDeleteParada() {
    if (!trechoAberto) return
    const confirmado = confirm(`Excluir a parada em ${trechoAberto.base}? Isso apaga os ${trechoAberto.dias.length} dia(s) dela.`)
    if (!confirmado) return
    dispatch({ type: 'itinerario/removeParada', ids: trechoAberto.dias.map((d) => d.id) })
    setOpenTrechoKey(null)
  }

  return (
    <div>
      {trechoAberto ? (
        <>
          <ScreenHeader title={trechoAberto.base} onBack={() => setOpenTrechoKey(null)} />
          <TrechoDetail
            trecho={trechoAberto}
            itinerarioCompleto={trip.itinerario}
            onEditDia={openEdit}
            onAddDia={() => openNewDia(trechoAberto.base)}
            onMove={(id, direction) => dispatch({ type: 'itinerario/move', id, direction })}
            onDeleteParada={handleDeleteParada}
          />
        </>
      ) : (
        <>
          <ScreenHeader
            title="Roteiro"
            right={
              <button
                onClick={() => setNovaParadaOpen(true)}
                className="inline-flex items-center gap-xxs text-body-sm text-ink dark:text-on-dark active:opacity-70"
              >
                <Plus size={16} /> Nova parada
              </button>
            }
          />
          <div className="px-lg py-base flex flex-col gap-sm">
            {trechos.length === 0 && (
              <p className="text-body-sm text-muted dark:text-on-dark-soft text-center py-xl">Nenhuma parada no roteiro ainda.</p>
            )}

            {trechos.map((trecho) => (
              <TrechoCard
                key={trecho.key}
                trecho={trecho}
                isAtual={trecho.dias.some((d) => diffInDays(parseISODate(d.data), today) === 0)}
                onOpen={() => setOpenTrechoKey(trecho.key)}
              />
            ))}

            <button
              onClick={() => setNovaParadaOpen(true)}
              className="flex items-center justify-center gap-xs h-12 rounded-xl border border-dashed border-hairline-strong dark:border-hairline-dark-strong text-body-md text-muted dark:text-on-dark-soft active:bg-surface-strong dark:active:bg-white/5"
            >
              <Plus size={18} /> Nova parada
            </button>
          </div>
        </>
      )}

      <DayEditorSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        dia={editingDia}
        defaultBase={sheetDefaultBase}
        onSave={handleSave}
        onDelete={editingDia ? handleDelete : undefined}
      />

      <NovaParadaSheet
        open={novaParadaOpen}
        onClose={() => setNovaParadaOpen(false)}
        onSave={(dias) => dispatch({ type: 'itinerario/addParada', dias })}
      />
    </div>
  )
}
