import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { RegionCover } from '../Itinerary/RegionCover'
import { CreateTripSheet } from './CreateTripSheet'
import { formatDateBR } from '../../lib/date'
import { supabase } from '../../lib/supabase'
import type { Trip } from '../../types/trip'

type TripRow = { id: string; data: Trip }

export function MyTripsScreen({ onBack, onOpenTrip }: { onBack: () => void; onOpenTrip: (tripId: string, trip: Trip) => void }) {
  const [trips, setTrips] = useState<TripRow[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('trips')
      .select('id, data')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return
        setTrips((data as TripRow[] | null) ?? [])
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <ScreenHeader title="Minhas viagens" onBack={onBack} />

      <div className="px-lg py-base flex flex-col gap-sm">
        {loading && <p className="text-body-sm text-muted dark:text-on-dark-soft text-center py-xl">Carregando…</p>}

        {!loading && trips.length === 0 && (
          <p className="text-body-sm text-muted dark:text-on-dark-soft text-center py-xl">Nenhuma viagem ainda.</p>
        )}

        {trips.map(({ id, data }) => (
          <button
            key={id}
            onClick={() => onOpenTrip(id, data)}
            className="w-full text-left rounded-xl overflow-hidden border border-hairline dark:border-hairline-dark bg-surface-card dark:bg-surface-dark-elevated active:opacity-90 transition-opacity"
          >
            <RegionCover base={data.meta.destino} className="w-full h-40" />
            <div className="p-base">
              <p className="text-caption-upper text-muted dark:text-on-dark-soft">{data.meta.destino}</p>
              <p className="text-title-md font-sans text-ink dark:text-on-dark">{data.meta.titulo}</p>
              <p className="text-body-sm text-muted dark:text-on-dark-soft">
                {formatDateBR(data.meta.inicio)} – {formatDateBR(data.meta.fim)}
              </p>
            </div>
          </button>
        ))}

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center justify-center gap-xs h-12 rounded-xl border border-dashed border-hairline-strong dark:border-hairline-dark-strong text-body-md text-muted dark:text-on-dark-soft active:bg-surface-strong dark:active:bg-white/5"
        >
          <Plus size={18} /> Nova viagem
        </button>
      </div>

      <CreateTripSheet open={createOpen} onClose={() => setCreateOpen(false)} onCreated={onOpenTrip} />
    </div>
  )
}
