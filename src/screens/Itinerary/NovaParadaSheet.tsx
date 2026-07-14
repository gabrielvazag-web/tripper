import { useState, type FormEvent } from 'react'
import { BottomSheet } from '../../components/ui/BottomSheet'
import { TextField } from '../../components/ui/Field'
import { Button } from '../../components/ui/Button'
import type { DiaRoteiro } from '../../types/trip'
import { datesInRange, weekdayAbbrevPT } from '../../lib/date'

export function NovaParadaSheet({
  open,
  onClose,
  onSave,
}: {
  open: boolean
  onClose: () => void
  onSave: (dias: Omit<DiaRoteiro, 'id'>[]) => void
}) {
  const [local, setLocal] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [erro, setErro] = useState<string | null>(null)

  function handleClose() {
    setLocal('')
    setDataInicio('')
    setDataFim('')
    setErro(null)
    onClose()
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!local || !dataInicio || !dataFim) return
    if (dataFim < dataInicio) {
      setErro('A data final precisa ser igual ou depois da data inicial.')
      return
    }

    const dias = datesInRange(dataInicio, dataFim).map(
      (data): Omit<DiaRoteiro, 'id'> => ({
        data,
        diaSemana: weekdayAbbrevPT(data),
        base: local,
        titulo: local,
        descricao: '',
      }),
    )
    onSave(dias)
    handleClose()
  }

  return (
    <BottomSheet open={open} onClose={handleClose} title="Nova parada">
      <form onSubmit={handleSubmit} className="flex flex-col gap-base">
        <p className="text-body-sm text-muted dark:text-on-dark-soft -mt-xs">
          Um novo lugar no roteiro. Depois é só entrar nele pra editar cada dia.
        </p>

        <TextField label="Local" value={local} onChange={(e) => setLocal(e.target.value)} placeholder="Ex.: Cidade do Cabo" required />

        <div className="grid grid-cols-2 gap-sm">
          <TextField label="De" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required />
          <TextField label="Até" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} required />
        </div>

        {erro && <p className="text-body-sm text-error">{erro}</p>}

        <Button type="submit" className="mt-sm">
          Criar parada
        </Button>
      </form>
    </BottomSheet>
  )
}
