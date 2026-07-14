import type { Gasto, Reserva, TipoReserva, Trip } from '../types/trip'

export const CATEGORIA_POR_TIPO: Record<TipoReserva, string> = {
  voo: 'Voos',
  hotel: 'Hospedagem',
  carro: 'Carro/Combustível',
  lodge: 'Safári',
  passeio: 'Passeios',
  outro: 'Outros',
}

/** Prefixo que marca um Gasto como derivado automaticamente de uma Reserva (não é editável na aba Gastos). */
export const RESERVA_GASTO_PREFIX = 'reserva-'

/** Converte uma reserva com valor + pagoPor no gasto compartilhado correspondente. */
export function reservaParaGasto(reserva: Reserva): Gasto | null {
  if (!reserva.valor || !reserva.moeda || !reserva.pagoPor) return null
  return {
    id: `${RESERVA_GASTO_PREFIX}${reserva.id}`,
    data: reserva.checkin ?? '',
    descricao: reserva.nome,
    categoria: CATEGORIA_POR_TIPO[reserva.tipo],
    valor: reserva.valor,
    moeda: reserva.moeda,
    pagoPor: reserva.pagoPor,
    divisao: 'igual',
  }
}

/** Todos os gastos da viagem: lançamentos manuais + os derivados das reservas com valor preenchido. */
export function getTodosGastos(trip: Trip): Gasto[] {
  const dasReservas = trip.reservas.map(reservaParaGasto).filter((g): g is Gasto => g !== null)
  return [...trip.gastos, ...dasReservas]
}

export function isGastoDeReserva(gastoId: string): boolean {
  return gastoId.startsWith(RESERVA_GASTO_PREFIX)
}
