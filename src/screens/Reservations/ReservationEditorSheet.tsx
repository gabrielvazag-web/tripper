import { useEffect, useState, type FormEvent } from 'react'
import type { Moeda, Pessoa, Reserva, StatusReserva, TipoReserva } from '../../types/trip'
import { BottomSheet } from '../../components/ui/BottomSheet'
import { TextField, TextAreaField, SelectField } from '../../components/ui/Field'
import { Button } from '../../components/ui/Button'
import { TIPO_LABELS } from './tipoLabels'

type FormState = {
  tipo: TipoReserva
  nome: string
  status: StatusReserva
  confirmacao: string
  checkin: string
  checkout: string
  horario: string
  local: string
  valor: string
  moeda: Moeda
  pagoPor: Pessoa
  notas: string
}

function toFormState(pessoas: Pessoa[], r?: Reserva, defaultTipo?: TipoReserva): FormState {
  return {
    tipo: r?.tipo ?? defaultTipo ?? 'outro',
    nome: r?.nome ?? '',
    status: r?.status ?? 'a_reservar',
    confirmacao: r?.confirmacao ?? '',
    checkin: r?.checkin ?? '',
    checkout: r?.checkout ?? '',
    horario: r?.horario ?? '',
    local: r?.local ?? '',
    valor: r?.valor !== undefined ? String(r.valor) : '',
    moeda: r?.moeda ?? 'BRL',
    pagoPor: r?.pagoPor ?? pessoas[0],
    notas: r?.notas ?? '',
  }
}

export function ReservationEditorSheet({
  open,
  onClose,
  reserva,
  defaultTipo,
  pessoas,
  onSave,
  onDelete,
}: {
  open: boolean
  onClose: () => void
  reserva?: Reserva
  defaultTipo?: TipoReserva
  pessoas: Pessoa[]
  onSave: (r: Omit<Reserva, 'id'>) => void
  onDelete?: () => void
}) {
  const [form, setForm] = useState<FormState>(() => toFormState(pessoas, reserva, defaultTipo))

  useEffect(() => {
    if (open) setForm(toFormState(pessoas, reserva, defaultTipo))
  }, [open, reserva, defaultTipo, pessoas])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.nome) return
    const temValor = Boolean(form.valor)
    onSave({
      tipo: form.tipo,
      nome: form.nome,
      status: form.status,
      confirmacao: form.confirmacao || undefined,
      checkin: form.checkin || undefined,
      checkout: form.checkout || undefined,
      horario: form.tipo === 'voo' ? form.horario || undefined : undefined,
      local: form.local || undefined,
      valor: temValor ? Number(form.valor) : undefined,
      moeda: temValor ? form.moeda : undefined,
      pagoPor: temValor ? form.pagoPor : undefined,
      notas: form.notas || undefined,
    })
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={reserva ? 'Editar reserva' : 'Nova reserva'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-base">
        <SelectField label="Tipo" value={form.tipo} onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value as TipoReserva }))}>
          {Object.entries(TIPO_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </SelectField>

        <TextField label="Nome" value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} placeholder="Ex.: Voo internacional" required />

        <SelectField label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as StatusReserva }))}>
          <option value="reservado">Reservado</option>
          <option value="a_reservar">A reservar</option>
        </SelectField>

        {form.tipo === 'voo' ? (
          <div className="grid grid-cols-2 gap-sm">
            <TextField label="Data do voo" type="date" value={form.checkin} onChange={(e) => setForm((f) => ({ ...f, checkin: e.target.value }))} />
            <TextField label="Horário do voo" type="time" value={form.horario} onChange={(e) => setForm((f) => ({ ...f, horario: e.target.value }))} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-sm">
            <TextField label="Check-in" type="date" value={form.checkin} onChange={(e) => setForm((f) => ({ ...f, checkin: e.target.value }))} />
            <TextField label="Check-out" type="date" value={form.checkout} onChange={(e) => setForm((f) => ({ ...f, checkout: e.target.value }))} />
          </div>
        )}

        <TextField label="Local" value={form.local} onChange={(e) => setForm((f) => ({ ...f, local: e.target.value }))} />
        <TextField label="Número de confirmação" value={form.confirmacao} onChange={(e) => setForm((f) => ({ ...f, confirmacao: e.target.value }))} />

        <div className="grid grid-cols-2 gap-sm">
          <TextField label="Valor" type="number" step="0.01" value={form.valor} onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))} />
          <SelectField label="Moeda" value={form.moeda} onChange={(e) => setForm((f) => ({ ...f, moeda: e.target.value as Moeda }))}>
            <option value="BRL">BRL</option>
            <option value="ZAR">ZAR</option>
            <option value="USD">USD</option>
          </SelectField>
        </div>

        {form.valor && (
          <SelectField label="Pago por" value={form.pagoPor} onChange={(e) => setForm((f) => ({ ...f, pagoPor: e.target.value as Pessoa }))}>
            {pessoas.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </SelectField>
        )}

        <TextAreaField label="Notas" value={form.notas} onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))} />

        <div className="flex flex-col gap-sm pt-sm">
          <Button type="submit">Salvar</Button>
          {onDelete && (
            <Button type="button" variant="outline" onClick={onDelete} className="text-error border-error/40">
              Excluir reserva
            </Button>
          )}
        </div>
      </form>
    </BottomSheet>
  )
}
