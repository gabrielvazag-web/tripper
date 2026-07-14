import type { Gasto, Moeda, Pessoa, Trip } from '../types/trip'

export function toBRL(valor: number, moeda: Moeda, meta: Trip['meta']): number {
  if (moeda === 'BRL') return valor
  if (moeda === 'ZAR') return valor * meta.cambioZARtoBRL
  return valor * meta.cambioUSDtoBRL
}

export function formatBRL(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatMoeda(valor: number, moeda: Moeda): string {
  const symbols: Record<Moeda, string> = { BRL: 'R$', ZAR: 'R', USD: 'US$' }
  return `${symbols[moeda]} ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/** Quanto cada pessoa deve pagar deste gasto, na moeda original do lançamento. */
export function computeShares(gasto: Gasto, pessoas: Pessoa[]): Record<Pessoa, number> {
  if (gasto.divisao === 'personalizada' && gasto.partes) {
    return gasto.partes
  }
  const porPessoa = gasto.valor / pessoas.length
  return Object.fromEntries(pessoas.map((p) => [p, porPessoa])) as Record<Pessoa, number>
}

export type Balances = {
  pago: Record<Pessoa, number>
  deveria: Record<Pessoa, number>
  net: Record<Pessoa, number>
  totalBRL: number
  resumo: string | null
}

export function computeBalances(gastos: Gasto[], meta: Trip['meta']): Balances {
  const pessoas = meta.viajantes as Pessoa[]
  const pago = Object.fromEntries(pessoas.map((p) => [p, 0])) as Record<Pessoa, number>
  const deveria = Object.fromEntries(pessoas.map((p) => [p, 0])) as Record<Pessoa, number>
  let totalBRL = 0

  for (const gasto of gastos) {
    const valorBRL = toBRL(gasto.valor, gasto.moeda, meta)
    totalBRL += valorBRL
    pago[gasto.pagoPor] = (pago[gasto.pagoPor] ?? 0) + valorBRL

    const shares = computeShares(gasto, pessoas)
    for (const pessoa of pessoas) {
      const shareOriginal = shares[pessoa] ?? 0
      const shareBRL = toBRL(shareOriginal, gasto.moeda, meta)
      deveria[pessoa] = (deveria[pessoa] ?? 0) + shareBRL
    }
  }

  const net = Object.fromEntries(pessoas.map((p) => [p, (pago[p] ?? 0) - (deveria[p] ?? 0)])) as Record<Pessoa, number>

  let resumo: string | null = null
  if (pessoas.length === 2) {
    const [a, b] = pessoas
    const diff = net[a] - net[b]
    if (Math.abs(diff) > 0.01) {
      const devedor = diff < 0 ? a : b
      const credor = diff < 0 ? b : a
      resumo = `${devedor} deve ${formatBRL(Math.abs(diff) / 2)} a ${credor}`
    }
  }

  return { pago, deveria, net, totalBRL, resumo }
}

/** Gasto sintético que zera o saldo atual entre as duas pessoas (acerto de contas). */
export function buildSettlementGasto(balances: Balances, pessoas: Pessoa[]): Omit<Gasto, 'id'> | null {
  if (pessoas.length !== 2) return null
  const [a, b] = pessoas
  const diff = balances.net[a] - balances.net[b]
  if (Math.abs(diff) < 0.01) return null
  const devedor = diff < 0 ? a : b
  const credor = diff < 0 ? b : a
  const valor = Math.abs(diff) / 2

  return {
    data: new Date().toISOString().slice(0, 10),
    descricao: 'Acerto de contas',
    categoria: 'Acerto',
    valor,
    moeda: 'BRL',
    pagoPor: devedor,
    divisao: 'personalizada',
    partes: { [devedor]: 0, [credor]: valor } as Record<Pessoa, number>,
  }
}
