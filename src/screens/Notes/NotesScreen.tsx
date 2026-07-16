import { useState } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { useTrip } from '../../store/TripContext'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { Card } from '../../components/ui/Card'
import { NoteEditorSheet } from './NoteEditorSheet'
import type { Nota } from '../../types/trip'
import { formatDateBR } from '../../lib/date'

export function NotesScreen({ onBack }: { onBack: () => void }) {
  const { trip, dispatch } = useTrip()
  const notas = trip.notas ?? []
  const [editing, setEditing] = useState<Nota | undefined>(undefined)
  const [sheetOpen, setSheetOpen] = useState(false)

  function openNew() {
    setEditing(undefined)
    setSheetOpen(true)
  }

  function openEdit(n: Nota) {
    setEditing(n)
    setSheetOpen(true)
  }

  function handleSave(texto: string) {
    if (editing) {
      dispatch({ type: 'notas/update', id: editing.id, texto })
    } else {
      dispatch({ type: 'notas/add', texto })
    }
  }

  function handleDelete() {
    if (editing) {
      dispatch({ type: 'notas/remove', id: editing.id })
      setSheetOpen(false)
    }
  }

  return (
    <div>
      <ScreenHeader
        title="Caderneta"
        onBack={onBack}
        right={
          <button onClick={openNew} className="inline-flex items-center gap-xxs text-body-sm text-ink dark:text-on-dark active:opacity-70">
            <Plus size={16} /> Nova
          </button>
        }
      />

      <div className="px-lg py-base flex flex-col gap-sm">
        <p className="text-body-sm text-muted dark:text-on-dark-soft -mt-xs mb-xs">
          Anotações soltas de antes e durante a viagem — ideias, lembretes, o que quiser guardar.
        </p>

        {notas.length === 0 && (
          <p className="text-body-sm text-muted dark:text-on-dark-soft text-center py-xl">Nenhuma anotação ainda.</p>
        )}

        {notas.map((n) => (
          <button key={n.id} onClick={() => openEdit(n)} className="text-left">
            <Card className="active:opacity-80 transition-opacity">
              <div className="flex items-start justify-between gap-sm">
                <p className="text-body-md text-ink dark:text-on-dark whitespace-pre-wrap">{n.texto}</p>
                <Pencil size={14} className="text-muted-soft shrink-0 mt-[2px]" />
              </div>
              <p className="text-caption text-muted-soft mt-xs">{formatDateBR(n.criadoEm.slice(0, 10))}</p>
            </Card>
          </button>
        ))}
      </div>

      <NoteEditorSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        nota={editing}
        onSave={handleSave}
        onDelete={editing ? handleDelete : undefined}
      />
    </div>
  )
}
