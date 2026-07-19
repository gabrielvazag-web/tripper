export type Pessoa = 'Gabs' | 'Clara'

export type Moeda = 'BRL' | 'ZAR' | 'USD'

export type Trip = {
  meta: {
    destino: string
    titulo: string
    inicio: string
    fim: string
    viajantes: string[]
    moedaLocal: 'ZAR'
    cambioZARtoBRL: number
    cambioUSDtoBRL: number
    orcamentoBRL?: number
  }
  itinerario: DiaRoteiro[]
  reservas: Reserva[]
  seguro: Seguro | null
  checklists: Checklist[]
  gastos: Gasto[]
  dicas: Dica[]
  notas: Nota[]
}

export type DiaRoteiro = {
  id: string
  data: string
  diaSemana: string
  base: string
  titulo: string
  descricao: string
  itens?: string[]
  reservado?: boolean
}

export type TipoReserva = 'voo' | 'hotel' | 'carro' | 'lodge' | 'passeio' | 'outro'
export type StatusReserva = 'reservado' | 'a_reservar'

export type Reserva = {
  id: string
  tipo: TipoReserva
  nome: string
  status: StatusReserva
  confirmacao?: string
  checkin?: string
  checkout?: string
  /** horário do voo (HH:MM) — só faz sentido pra tipo 'voo' */
  horario?: string
  local?: string
  valor?: number
  moeda?: Moeda
  /** quem pagou — define o gasto correspondente que aparece na aba Gastos */
  pagoPor?: Pessoa
  notas?: string
  /** id da imagem anexada, guardada localmente no IndexedDB (ver src/store/imageStore.ts) */
  imagemId?: string
}

export type Seguro = {
  seguradora?: string
  apolice?: string
  vigencia?: string
  telefoneEmergencia?: string
  cobertura?: string
  notas?: string
  /** id da imagem anexada, guardada localmente no IndexedDB (ver src/store/imageStore.ts) */
  imagemId?: string
}

export type ChecklistItem = {
  id: string
  texto: string
  feito: boolean
}

export type Checklist = {
  id: string
  titulo: string
  grupo: 'mala' | 'reservas' | 'documentos' | 'outro'
  itens: ChecklistItem[]
}

export type Gasto = {
  id: string
  data: string
  descricao: string
  categoria: string
  valor: number
  moeda: Moeda
  pagoPor: Pessoa
  divisao: 'igual' | 'personalizada'
  partes?: Record<Pessoa, number>
}

export type Dica = {
  id: string
  categoria: string
  titulo: string
  texto: string
}

export type Nota = {
  id: string
  texto: string
  criadoEm: string
}
