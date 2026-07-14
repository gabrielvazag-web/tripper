import type { TipoReserva } from '../../types/trip'

export const TIPO_LABELS: Record<TipoReserva, string> = {
  voo: 'Voo',
  hotel: 'Hotel',
  carro: 'Carro',
  lodge: 'Lodge',
  passeio: 'Passeio',
  outro: 'Outro',
}

export const TIPO_ORDER: TipoReserva[] = ['voo', 'hotel', 'carro', 'lodge', 'passeio', 'outro']
