import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { Checklist, ChecklistItem, Dica, DiaRoteiro, Gasto, Reserva, Seguro, Trip } from '../types/trip'
import { seedTrip } from './seed'
import { newId } from '../lib/id'

const STORAGE_KEY = 'africatrip:trip:v1'

function loadInitialState(): Trip {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Trip
  } catch {
    // localStorage indisponível ou dado corrompido — cai pro seed
  }
  return seedTrip
}

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
}

const TripContext = createContext<TripContextValue | null>(null)

export function TripProvider({ children }: { children: ReactNode }) {
  const [trip, dispatch] = useReducer(reducer, undefined, loadInitialState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trip))
    } catch {
      // storage cheio/indisponível — ignora silenciosamente, dado ainda vive em memória
    }
  }, [trip])

  const value = useMemo(() => ({ trip, dispatch }), [trip])

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export function useTrip() {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTrip precisa estar dentro de <TripProvider>')
  return ctx
}
