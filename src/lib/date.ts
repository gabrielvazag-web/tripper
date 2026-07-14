import type { DiaRoteiro } from '../types/trip'

const MS_DIA = 1000 * 60 * 60 * 24

const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

/** Meia-noite local a partir de uma data 'YYYY-MM-DD', evitando o fuso UTC do Date nativo. */
export function parseISODate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayAtMidnight(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function formatDateBR(dateStr: string): string {
  const d = parseISODate(dateStr)
  return `${d.getDate()} de ${MESES[d.getMonth()]}`
}

const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

export function weekdayAbbrevPT(dateStr: string): string {
  return DIAS_SEMANA[parseISODate(dateStr).getDay()]
}

/** Lista de datas 'YYYY-MM-DD', uma por dia, de início a fim (inclusive). */
export function datesInRange(inicio: string, fim: string): string[] {
  const start = parseISODate(inicio)
  const end = parseISODate(fim)
  const dias: string[] = []
  for (let d = start; d <= end; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    dias.push(`${yyyy}-${mm}-${dd}`)
  }
  return dias
}

export function diffInDays(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / MS_DIA)
}

export type TripPhase = 'antes' | 'durante' | 'depois'

export function getTripPhase(inicio: string, fim: string, today: Date = todayAtMidnight()): TripPhase {
  const start = parseISODate(inicio)
  const end = parseISODate(fim)
  if (today < start) return 'antes'
  if (today > end) return 'depois'
  return 'durante'
}

/** Contagem regressiva (dias até o início) ou o número do dia atual da viagem (1-based). */
export function getCountdownOrDayNumber(inicio: string, fim: string, today: Date = todayAtMidnight()) {
  const phase = getTripPhase(inicio, fim, today)
  const start = parseISODate(inicio)
  const end = parseISODate(fim)
  const totalDias = diffInDays(end, start) + 1

  if (phase === 'antes') {
    return { phase, diasRestantes: diffInDays(start, today), totalDias }
  }
  if (phase === 'durante') {
    return { phase, diaAtual: diffInDays(today, start) + 1, totalDias }
  }
  return { phase, totalDias }
}

export function findHojeEProximo(itinerario: DiaRoteiro[], today: Date = todayAtMidnight()) {
  const ordenado = [...itinerario].sort((a, b) => a.data.localeCompare(b.data))
  const hoje = ordenado.find((d) => diffInDays(parseISODate(d.data), today) === 0) ?? null
  const referencia = hoje ? parseISODate(hoje.data) : today
  const proximo = ordenado.find((d) => parseISODate(d.data) > referencia) ?? null
  return { hoje, proximo }
}
