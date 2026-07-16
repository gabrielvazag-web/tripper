import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react'
import type { Checklist, ChecklistItem, Dica, DiaRoteiro, Gasto, Reserva, Seguro, Trip } from '../types/trip'
import { supabase } from '../lib/supabase'
import { newId } from '../lib/id'

type Action =
  | { type: 'meta/update'; patch: Partial<Trip['meta']> }
  | { type: 'itinerario/add'; dia: Omit<DiaRoteiro, 'id'> }
  | { type: 'itinerario/addParada'; dias: Omit<DiaRoteiro, 'id'>[] }
  | { type: 'itinerario/update'; id: string; patch: Partial<DiaRoteiro> }
  | { type: 'itinerario/remove'; id: string }
  | { type: 'itinerario/removeParada'; ids: string[] }
  | { type: 'itinerario/move'; id: string; direction: 'up' | 'down' }
  | { type: 'reservas/add'; reserva: Omit<Reserva, 'id'> }
  | { type: 'reservas/update'; id: string; patch: Partial<Reserva> }
  | { type: 'reservas/remove'; id: string }
  | { type: 'seguro/update'; patch: Partial<Seguro> }
  | { type: 'checklists/addList'; titulo: string; grupo: Checklist['grupo'] }
  | { type: 'checklists/renameList'; id: string; titulo: string }
  | { type: 'checklists/removeList'; id: string }
  | { type: 'checklists/addItem'; listId: string; texto: string }
  | { type: 'checklists/updateItem'; listId: string; itemId: string; patch: Partial<ChecklistItem> }
  | { type: 'checklists/removeItem'; listId: string; itemId: string }
  | { type: 'gastos/add'; gasto: Omit<Gasto, 'id'> }
  | { type: 'gastos/update'; id: string; patch: Partial<Gasto> }
  | { type: 'gastos/remove'; id: string }
  | { type: 'dicas/add'; dica: Omit<Dica, 'id'> }
  | { type: 'dicas/update'; id: string; patch: Partial<Dica> }
  | { type: 'dicas/remove'; id: string }
  | { type: 'trip/replace'; trip: Trip }

function reducer(state: Trip, action: Action): Trip {
  switch (action.type) {
    case 'meta/update':
      return { ...state, meta: { ...state.meta, ...action.patch } }

    case 'itinerario/add':
      return { ...state, itinerario: [...state.itinerario, { ...action.dia, id: newId('d') }] }
    case 'itinerario/addParada':
      return { ...state, itinerario: [...state.itinerario, ...action.dias.map((dia) => ({ ...dia, id: newId('d') }))] }
    case 'itinerario/update':
      return {
        ...state,
        itinerario: state.itinerario.map((d) => (d.id === action.id ? { ...d, ...action.patch } : d)),
      }
    case 'itinerario/remove':
      return { ...state, itinerario: state.itinerario.filter((d) => d.id !== action.id) }
    case 'itinerario/removeParada':
      return { ...state, itinerario: state.itinerario.filter((d) => !action.ids.includes(d.id)) }
    case 'itinerario/move': {
      const idx = state.itinerario.findIndex((d) => d.id === action.id)
      if (idx === -1) return state
      const swapWith = action.direction === 'up' ? idx - 1 : idx + 1
      if (swapWith < 0 || swapWith >= state.itinerario.length) return state
      const next = [...state.itinerario]
      ;[next[idx], next[swapWith]] = [next[swapWith], next[idx]]
      return { ...state, itinerario: next }
    }

    case 'reservas/add':
      return { ...state, reservas: [...state.reservas, { ...action.reserva, id: newId('r') }] }
    case 'reservas/update':
      return {
        ...state,
        reservas: state.reservas.map((r) => (r.id === action.id ? { ...r, ...action.patch } : r)),
      }
    case 'reservas/remove':
      return { ...state, reservas: state.reservas.filter((r) => r.id !== action.id) }

    case 'seguro/update':
      return { ...state, seguro: { ...state.seguro, ...action.patch } }

    case 'checklists/addList':
      return {
        ...state,
        checklists: [...state.checklists, { id: newId('c'), titulo: action.titulo, grupo: action.grupo, itens: [] }],
      }
    case 'checklists/renameList':
      return {
        ...state,
        checklists: state.checklists.map((l) => (l.id === action.id ? { ...l, titulo: action.titulo } : l)),
      }
    case 'checklists/removeList':
      return { ...state, checklists: state.checklists.filter((l) => l.id !== action.id) }
    case 'checklists/addItem':
      return {
        ...state,
        checklists: state.checklists.map((l) =>
          l.id === action.listId ? { ...l, itens: [...l.itens, { id: newId('ci'), texto: action.texto, feito: false }] } : l,
        ),
      }
    case 'checklists/updateItem':
      return {
        ...state,
        checklists: state.checklists.map((l) =>
          l.id === action.listId
            ? { ...l, itens: l.itens.map((it) => (it.id === action.itemId ? { ...it, ...action.patch } : it)) }
            : l,
        ),
      }
    case 'checklists/removeItem':
      return {
        ...state,
        checklists: state.checklists.map((l) =>
          l.id === action.listId ? { ...l, itens: l.itens.filter((it) => it.id !== action.itemId) } : l,
        ),
      }

    case 'gastos/add':
      return { ...state, gastos: [...state.gastos, { ...action.gasto, id: newId('g') }] }
    case 'gastos/update':
      return { ...state, gastos: state.gastos.map((g) => (g.id === action.id ? { ...g, ...action.patch } : g)) }
    case 'gastos/remove':
      return { ...state, gastos: state.gastos.filter((g) => g.id !== action.id) }

    case 'dicas/add':
      return { ...state, dicas: [...state.dicas, { ...action.dica, id: newId('t') }] }
    case 'dicas/update':
      return { ...state, dicas: state.dicas.map((t) => (t.id === action.id ? { ...t, ...action.patch } : t)) }
    case 'dicas/remove':
      return { ...state, dicas: state.dicas.filter((t) => t.id !== action.id) }

    case 'trip/replace':
      return action.trip

    default:
      return state
  }
}

type TripContextValue = {
  trip: Trip
  dispatch: React.Dispatch<Action>
  tripId: string
}

const TripContext = createContext<TripContextValue | null>(null)

/**
 * A viagem já vem carregada de fora (lista de viagens ou criação) — o Provider só
 * cuida de manter o Supabase em dia: escreve com debounce a cada mudança e escuta
 * o realtime pra refletir edições feitas pela outra pessoa na mesma viagem.
 */
export function TripProvider({ tripId, initialTrip, children }: { tripId: string; initialTrip: Trip; children: ReactNode }) {
  const [trip, dispatch] = useReducer(reducer, initialTrip)
  const lastPushedJson = useRef(JSON.stringify(initialTrip))
  const isFirstRun = useRef(true)

  useEffect(() => {
    const channel = supabase
      .channel(`trip-${tripId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'trips', filter: `id=eq.${tripId}` },
        (payload) => {
          const incoming = (payload.new as { data: Trip }).data
          const incomingJson = JSON.stringify(incoming)
          if (incomingJson === lastPushedJson.current) return
          lastPushedJson.current = incomingJson
          dispatch({ type: 'trip/replace', trip: incoming })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [tripId])

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    const json = JSON.stringify(trip)
    const handle = setTimeout(() => {
      lastPushedJson.current = json
      supabase
        .from('trips')
        .update({ data: trip })
        .eq('id', tripId)
        .then(({ error }) => {
          if (error) console.error('Falha ao salvar viagem no Supabase', error)
        })
    }, 700)
    return () => clearTimeout(handle)
  }, [trip, tripId])

  const value = useMemo(() => ({ trip, dispatch, tripId }), [trip, tripId])

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export function useTrip() {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTrip precisa estar dentro de <TripProvider>')
  return ctx
}
