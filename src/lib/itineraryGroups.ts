import type { DiaRoteiro } from '../types/trip'

export type Trecho = {
  key: string
  base: string
  dias: DiaRoteiro[]
  dataInicio: string
  dataFim: string
}

/**
 * Agrupa dias consecutivos que compartilham a mesma base (ex.: 4 dias em
 * "Cidade do Cabo" viram um único card de trecho). A ordem do array de
 * entrada é a ordem de exibição — a mesma que itinerario/move reordena.
 */
export function agruparPorTrecho(itinerario: DiaRoteiro[]): Trecho[] {
  const trechos: Trecho[] = []

  for (const dia of itinerario) {
    const atual = trechos[trechos.length - 1]
    if (atual && atual.base === dia.base) {
      atual.dias.push(dia)
      atual.dataFim = dia.data
    } else {
      trechos.push({ key: dia.id, base: dia.base, dias: [dia], dataInicio: dia.data, dataFim: dia.data })
    }
  }

  return trechos
}
