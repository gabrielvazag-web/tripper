import { useEffect, useState, type FormEvent } from 'react'
import type { DiaRoteiro } from '../../types/trip'
import { BottomSheet } from '../../components/ui/BottomSheet'
import { TextField, TextAreaField } from '../../components/ui/Field'
import { Button } from '../../components/ui/Button'
import { weekdayAbbrevPT } from '../../lib/date'

type FormState = {
  data: string
  base: string
  titulo: string
  descricao: string
  itensTexto: string
  reservado: boolean
}

function toFormState(dia?: DiaRoteiro, defaultBase?: string): FormState {
  return {
    data: dia?.data ?? '',
    base: dia?.base ?? defaultBase ?? '',
    titulo: dia?.titulo ?? '',
    descricao: dia?.descricao ?? '',
    itensTexto: dia?.itens?.join('\n') ?? '',
    reservado: dia?.reservado ?? false,
  }
}

export function DayEditorSheet({
  open,
  onClose,
  dia,
  defaultBase,
  onSave,
  onDelete,
}: {
  open: boolean
  onClose: () => void
  dia?: DiaRoteiro
  defaultBase?: string
  onSave: (dia: Omit<DiaRoteiro, 'id'>) => void
  onDelete?: () => void
}) {
  const [form, setForm] = useState<FormState>(() => toFormState(dia, defaultBase))

  useEffect(() => {
    if (open) setForm(toFormState(dia, defaultBase))
  }, [open, dia, defaultBase])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.data || !form.titulo) return
    onSave({
      data: form.data,
      diaSemana: weekdayAbbrevPT(form.data),
      base: form.base,
      titulo: form.titulo,
      descricao: form.descricao,
      itens: form.itensTexto
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      reservado: form.reservado,
    })
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={dia ? 'Editar dia' : 'Novo dia'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-base">
        <TextField label="Data" type="date" value={form.data} onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))} required />
        <TextField label="Base / cidade" value={form.base} onChange={(e) => setForm((f) => ({ ...f, base: e.target.value }))} placeholder="Ex.: Cidade do Cabo" />
        <TextField label="Título" value={form.titulo} onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} placeholder="Ex.: Península do Cabo" required />
        <TextAreaField label="Descrição" value={form.descricao} onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))} />
        <TextAreaField
          label="Itens (um por linha)"
          value={form.itensTexto}
          onChange={(e) => setForm((f) => ({ ...f, itensTexto: e.target.value }))}
          placeholder={"Chapman's Peak Drive\nCabo da Boa Esperança"}
        />
        <label className="flex items-center gap-sm text-body-md text-ink dark:text-on-dark">
          <input
            type="checkbox"
            checked={form.reservado}
            onChange={(e) => setForm((f) => ({ ...f, reservado: e.target.checked }))}
            className="w-5 h-5 rounded accent-success"
          />
          Marcar como reservado
        </label>

        <div className="flex flex-col gap-sm pt-sm">
          <Button type="submit">Salvar</Button>
          {onDelete && (
            <Button type="button" variant="outline" onClick={onDelete} className="text-error border-error/40">
              Excluir dia
            </Button>
          )}
        </div>
      </form>
    </BottomSheet>
  )
}
