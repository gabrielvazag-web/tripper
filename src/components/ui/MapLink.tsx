import { MapPin } from 'lucide-react'
import { mapsUrl } from '../../lib/maps'

export function MapLink({ query, label = 'Ver no mapa' }: { query: string; label?: string }) {
  return (
    <a
      href={mapsUrl(query)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-xxs text-body-sm text-ink dark:text-on-dark active:opacity-70"
    >
      <MapPin size={14} /> {label}
    </a>
  )
}
