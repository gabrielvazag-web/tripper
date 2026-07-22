import { motion, useReducedMotion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { mapsUrl } from '../../lib/maps'
import { spring } from '../../lib/motion'

export function MapLink({ query, label = 'Ver no mapa' }: { query: string; label?: string }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.a
      href={mapsUrl(query)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-xxs text-body-sm text-ink dark:text-on-dark"
      whileTap={reduceMotion ? undefined : { scale: 0.95, opacity: 0.7 }}
      transition={spring.snappy}
    >
      <MapPin size={14} /> {label}
    </motion.a>
  )
}
