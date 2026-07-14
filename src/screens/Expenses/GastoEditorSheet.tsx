import { useEffect, useState, type FormEvent } from 'react'
import type { Gasto, Moeda, Pessoa } from '../../types/trip'
import { BottomSheet } from '../../components/ui/BottomSheet'
import { TextField, SelectField } from '../../components/ui/Field'
import { Button } from '../../components/ui/Button'
import { CATEGORIAS_SUGERIDAS } from './categorias'

type FormState = {
  data: string
  descricao: string
  categoria: string
  valor: string
  moeda: Moeda
  pagoPor: Pessoa
  divisao: 'igual' | 'personalizada'
  parteGabs: string
  parteClara: string
}

function toFormState(pessoas: Pessoa[], g?: Gasto): FormState {
  return {
    data: g?.data ?? new Date().toISOString().slice(0, 10),
    descricao: g?.descricao ?? '',
    categoria: g?.categoria ?? CATEGORIAS_SUGERIDAS[0],
    valor: g?.valor !== undefined ? String(g.valor) : '',
    moeda: g?.moeda ?? 'ZAR',
    pagoPor: g?.pagoPor ?? pessoas[0],
    divisao: g?.divisao ?? 'igual',
    parteGabs: g?.partes?.['Gabs'] !== undefined ? String(g.partes['Gabs']) : '',
    parteClara: g?.partes?.['Clara'] !== undefined ? String(g.partes['Clara']) : '',
  }
}

export function GastoEditorSheet({
  open,
  onClose,
  gasto,
  pessoas,
  onSave,
  onDelete,
}: {
  open: boolean
  onClose: () => void
  gasto?: Gasto
  pessoas: Pessoa[]
  onSave: (g: Omit<Gasto, 'id'>) => void
  onDelete?: () => void
}) {
  const [form, setForm] = useState<FormState>(() => toFormState(pessoas, gasto))

  useEffect(() => {
    if (open) setForm(toFormState(pessoas, gasto))
  }, [open, gasto, pessoas])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const valor = Number(form.valor)
    if (!form.descricao || !valor) return

    onSave({
      data: form.data,
      descricao: form.descricao,
      categoria: form.categoria,
      valor,
      moeda: form.moeda,
      pagoPor: form.pagoPor,
      divisao: form.divisao,
      partes:
        form.divisao === 'personalizada'
          ? ({ Gabs: Number(form.parteGabs) || 0, Clara: Number(form.parteClara) || 0 } as Record<Pessoa, number>)
          : undefined,
    })
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={gasto ? 'Editar gasto' : 'Novo gasto'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-base">
        <TextField label="Descrição" value={form.descricao} onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))} placeholder="Ex.: Jantar em Camps Bay" required />

        <SelectField label="Categoria" value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}>
          {CATEGORIAS_SUGERIDAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </SelectField>

        <div className="grid grid-cols-2 gap-sm">
          <TextField label="Valor" type="number" step="0.01" value={form.valor} onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))} required />
          <SelectField label="Moeda" value={form.moeda} onChange={(e) => setForm((f) => ({ ...f, moeda: e.target.value as Moeda }))}>
            <option value="ZAR">ZAR</option>
            <option value="BRL">BRL</option>
            <option value="USD">USD</option>
          </SelectField>
        </div>

        <TextField label="Data" type="date" value={form.data} onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))} />

        <SelectField label="Pago por" value={form.pagoPor} onChange={(e) => setForm((f) => ({ ...f, pagoPor: e.target.value as Pessoa }))}>
          {pessoas.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </SelectField>

        <SelectField label="Divisão" value={form.divisao} onChange={(e) => setForm((f) => ({ ...f, divisao: e.target.value as FormState['divisao'] }))}>
          <option value="igual">Meio a meio</option>
          <option value="personalizada">Personalizada</option>
        </SelectField>

        {form.divisao === 'personalizada' && (
          <div className="grid grid-cols-2 gap-sm">
            <TextField label="Parte Gabs" type="number" step="0.01" value={form.parteGabs} onChange={(e) => setForm((f) => ({ ...f, parteGabs: e.target.value }))} />
            <TextField label="Parte Clara" type="number" step="0.01" value={form.parteClara} onChange={(e) => setForm((f) => ({ ...f, parteClara: e.target.value }))} />
          </div>
        )}

        <div className="flex flex-col gap-sm pt-sm">
          <Button type="submit">Salvar</Button>
          {onDelete && (
            <Button type="button" variant="outline" onClick={onDelete} className="text-error border-error/40">
              Excluir gasto
            </Button>
          )}
        </div>
      </form>
    </BottomSheet>
  )
}
