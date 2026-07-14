import { useTrip } from '../../store/TripContext'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { formatDateBR } from '../../lib/date'

export function MyTripsScreen({ onBack, onOpenTrip }: { onBack: () => void; onOpenTrip: () => void }) {
  const { trip } = useTrip()

  return (
    <div>
      <ScreenHeader title="Minhas viagens" onBack={onBack} />

      <div className="px-lg py-base">
        <button
          onClick={onOpenTrip}
          className="w-full text-left rounded-xl overflow-hidden border border-hairline dark:border-hairline-dark bg-surface-card dark:bg-surface-dark-elevated active:opacity-90 transition-opacity"
        >
          <img src="/photos/cidade-do-cabo.jpg" alt={trip.meta.destino} className="w-full h-40 object-cover" />
          <div className="p-base">
            <p className="text-caption-upper text-muted dark:text-on-dark-soft">{trip.meta.destino}</p>
            <p className="text-title-md font-sans text-ink dark:text-on-dark">{trip.meta.titulo}</p>
            <p className="text-body-sm text-muted dark:text-on-dark-soft">
              {formatDateBR(trip.meta.inicio)} – {formatDateBR(trip.meta.fim)}
            </p>
          </div>
        </button>
      </div>
    </div>
  )
}
