import { useMemo, useState } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { useTrip } from '../../store/TripContext'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { Accordion } from '../../components/ui/Accordion'
import { DicaEditorSheet } from './DicaEditorSheet'
import type { Dica } from '../../types/trip'

export function TipsScreen({ onBack }: { onBack: () => void }) {
  const { trip, dispatch } = useTrip()
  const [editing, setEditing] = useState<Dica | undefined>(undefined)
  const [sheetOpen, setSheetOpen] = useState(false)

  const porCategoria = useMemo(() => {
    const map = new Map<string, Dica[]>()
    for (const d of trip.dicas) {
      const lista = map.get(d.categoria) ?? []
      lista.push(d)
      map.set(d.categoria, lista)
    }
    return [...map.entries()]
  }, [trip.dicas])

  function openNew() {
    setEditing(undefined)
    setSheetOpen(true)
  }

  function openEdit(d: Dica) {
    setEditing(d)
    setSheetOpen(true)
  }

  function handleSave(patch: Omit<Dica, 'id'>) {
    if (editing) {
      dispatch({ type: 'dicas/update', id: editing.id, patch })
    } else {
      dispatch({ type: 'dicas/add', dica: patch })
    }
  }

  function handleDelete() {
    if (editing) {
      dispatch({ type: 'dicas/remove', id: editing.id })
      setSheetOpen(false)
    }
  }

  return (
    <div>
      <ScreenHeader
        title="Dicas"
        onBack={onBack}
        right={
          <button onClick={openNew} className="inline-flex items-center gap-xxs text-body-sm text-ink dark:text-on-dark active:opacity-70">
            <Plus size={16} /> Nova
          </button>
        }
      />

      <div className="px-lg py-base flex flex-col gap-sm">
        {porCategoria.length === 0 && (
          <p className="text-body-sm text-muted dark:text-on-dark-soft text-center py-xl">Nenhuma dica cadastrada ainda.</p>
        )}

        {porCategoria.map(([categoria, dicas]) => (
          <Accordion key={categoria} title={categoria} subtitle={`${dicas.length} dica${dicas.length > 1 ? 's' : ''}`}>
            <div className="flex flex-col gap-base">
              {dicas.map((d) => (
                <div key={d.id}>
                  <div className="flex items-start justify-between gap-sm">
                    <p className="text-title-sm font-sans text-ink dark:text-on-dark">{d.titulo}</p>
                    <button onClick={() => openEdit(d)} className="p-xs -mr-xs active:opacity-60 shrink-0">
                      <Pencil size={14} className="text-muted-soft" />
                    </button>
                  </div>
                  <p className="text-body-sm text-body dark:text-on-dark-soft">{d.texto}</p>
                </div>
              ))}
            </div>
          </Accordion>
        ))}
      </div>

      <DicaEditorSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        dica={editing}
        onSave={handleSave}
        onDelete={editing ? handleDelete : undefined}
      />
    </div>
  )
}
