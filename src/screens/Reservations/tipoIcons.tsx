import { Building2, Car, Compass, Package, Plane, Tent } from 'lucide-react'
import type { TipoReserva } from '../../types/trip'

export const TIPO_ICON: Record<TipoReserva, typeof Plane> = {
  voo: Plane,
  hotel: Building2,
  carro: Car,
  lodge: Tent,
  passeio: Compass,
  outro: Package,
}

export const TIPO_BADGE_BG: Record<TipoReserva, string> = {
  voo: 'bg-gradient-sky',
  hotel: 'bg-gradient-lavender',
  carro: 'bg-gradient-peach',
  lodge: 'bg-gradient-mint',
  passeio: 'bg-gradient-rose',
  outro: 'bg-surface-strong dark:bg-white/10',
}
