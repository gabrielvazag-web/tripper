import { useEffect, useState, type FormEvent } from 'react'
import type { Dica } from '../../types/trip'
import { BottomSheet } from '../../components/ui/BottomSheet'
import { TextField, TextAreaField } from '../../components/ui/Field'
import { Button } from '../../components/ui/Button'

type FormState = { categoria: string; titulo: string; texto: string }

function toFormState(d?: Dica): FormState {
  return { categoria: d?.categoria ?? '', titulo: d?.titulo ?? '', texto: d?.texto ?? '' }
}

export function DicaEditorSheet({
  open,
  onClose,
  dica,
  onSave,
  onDelete,
}: {
  open: boolean
  onClose: () => void
  dica?: Dica
  onSave: (d: Omit<Dica, 'id'>) => void
  onDelete?: () => void
}) {
  const [form, setForm] = useState<FormState>(() => toFormState(dica))

  useEffect(() => {
    if (open) setForm(toFormState(dica))
  }, [open, dica])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.titulo || !form.categoria) return
    onSave(form)
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={dica ? 'Editar dica' : 'Nova dica'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-base">
        <TextField label="Categoria" value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))} placeholder="Ex.: Saúde" required />
        <TextField label="Título" value={form.titulo} onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} required />
        <TextAreaField label="Texto" value={form.texto} onChange={(e) => setForm((f) => ({ ...f, texto: e.target.value }))} />

        <div className="flex flex-col gap-sm pt-sm">
          <Button type="submit">Salvar</Button>
          {onDelete && (
            <Button type="button" variant="outline" onClick={onDelete} className="text-error border-error/40">
              Excluir dica
            </Button>
          )}
        </div>
      </form>
    </BottomSheet>
  )
}
