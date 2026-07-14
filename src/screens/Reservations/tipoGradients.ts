import type { TipoReserva } from '../../types/trip'

/**
 * Gradientes mais saturados que os tokens pastel do design system — usados
 * só nos cards de grade de Reservas (fundo cheio + texto branco), na mesma
 * família de matiz de cada tipo pra manter a identidade visual do app.
 */
export const TIPO_GRADIENT: Record<TipoReserva, { from: string; to: string }> = {
  voo: { from: '#3f7cc4', to: '#7ba9e8' },
  hotel: { from: '#7c6bb0', to: '#a893d6' },
  carro: { from: '#d97b4a', to: '#f0a877' },
  lodge: { from: '#2f9e78', to: '#63c9a0' },
  passeio: { from: '#c85777', to: '#e893a8' },
  outro: { from: '#57534e', to: '#8a8580' },
}
