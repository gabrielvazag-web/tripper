import { useEffect, useState, type FormEvent } from 'react'
import type { Nota } from '../../types/trip'
import { BottomSheet } from '../../components/ui/BottomSheet'
import { TextAreaField } from '../../components/ui/Field'
import { Button } from '../../components/ui/Button'

export function NoteEditorSheet({
  open,
  onClose,
  nota,
  onSave,
  onDelete,
}: {
  open: boolean
  onClose: () => void
  nota?: Nota
  onSave: (texto: string) => void
  onDelete?: () => void
}) {
  const [texto, setTexto] = useState(nota?.texto ?? '')

  useEffect(() => {
    if (open) setTexto(nota?.texto ?? '')
  }, [open, nota])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!texto.trim()) return
    onSave(texto.trim())
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={nota ? 'Editar anotação' : 'Nova anotação'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-base">
        <TextAreaField
          label="Anotação"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ex.: Levar câmbio extra pra gorjetas do safári"
          autoFocus
          required
          rows={5}
        />

        <div className="flex flex-col gap-sm pt-sm">
          <Button type="submit">Salvar</Button>
          {onDelete && (
            <Button type="button" variant="outline" onClick={onDelete} className="text-error border-error/40">
              Excluir anotação
            </Button>
          )}
        </div>
      </form>
    </BottomSheet>
  )
}
