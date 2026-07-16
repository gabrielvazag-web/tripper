import { useState, type FormEvent } from 'react'
import { BottomSheet } from '../../components/ui/BottomSheet'
import { TextField } from '../../components/ui/Field'
import { Button } from '../../components/ui/Button'
import type { Trip } from '../../types/trip'
import { supabase } from '../../lib/supabase'

function buildTrip(destino: string, titulo: string, inicio: string, fim: string): Trip {
  return {
    meta: { destino, titulo, inicio, fim, viajantes: [], moedaLocal: 'ZAR', cambioZARtoBRL: 1, cambioUSDtoBRL: 1 },
    itinerario: [],
    reservas: [],
    seguro: null,
    checklists: [],
    gastos: [],
    dicas: [],
  }
}

export function CreateTripSheet({
  open,
  onClose,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated: (tripId: string, trip: Trip) => void
}) {
  const [destino, setDestino] = useState('')
  const [titulo, setTitulo] = useState('')
  const [inicio, setInicio] = useState('')
  const [fim, setFim] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  function handleClose() {
    setDestino('')
    setTitulo('')
    setInicio('')
    setFim('')
    setErro(null)
    onClose()
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!destino || !titulo || !inicio || !fim) return
    if (fim < inicio) {
      setErro('A data final precisa ser igual ou depois da data inicial.')
      return
    }

    setLoading(true)
    setErro(null)
    const trip = buildTrip(destino, titulo, inicio, fim)
    const { data, error } = await supabase.rpc('create_trip', { trip_data: trip })
    setLoading(false)
    if (error || !data) {
      setErro('Não foi possível criar a viagem. Tenta de novo.')
      return
    }
    onCreated(data as string, trip)
    handleClose()
  }

  return (
    <BottomSheet open={open} onClose={handleClose} title="Nova viagem">
      <form onSubmit={handleSubmit} className="flex flex-col gap-base">
        <TextField label="Destino" value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Ex.: África do Sul" required />
        <TextField label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Lua de mel" required />

        <div className="grid grid-cols-2 gap-sm">
          <TextField label="De" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} required />
          <TextField label="Até" type="date" value={fim} onChange={(e) => setFim(e.target.value)} required />
        </div>

        {erro && <p className="text-body-sm text-error">{erro}</p>}

        <Button type="submit" className="mt-sm" disabled={loading}>
          {loading ? 'Criando…' : 'Criar viagem'}
        </Button>
      </form>
    </BottomSheet>
  )
}
