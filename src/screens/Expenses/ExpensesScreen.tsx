import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTrip } from '../../store/TripContext'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { Card } from '../../components/ui/Card'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { AnimatedNumber } from '../../components/ui/AnimatedNumber'
import { StaggerList, StaggerItem } from '../../components/ui/Stagger'
import { duration, ease } from '../../lib/motion'
import { GastoRow } from './GastoRow'
import { GastoEditorSheet } from './GastoEditorSheet'
import type { Gasto, Pessoa } from '../../types/trip'
import { buildSettlementGasto, computeBalances, formatBRL, toBRL } from '../../lib/money'
import { getTodosGastos } from '../../lib/reservaGastos'

export function ExpensesScreen() {
  const { trip, dispatch } = useTrip()
  const [editing, setEditing] = useState<Gasto | undefined>(undefined)
  const [sheetOpen, setSheetOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  const pessoas = trip.meta.viajantes as Pessoa[]
  const todosGastos = useMemo(() => getTodosGastos(trip), [trip])
  const balances = useMemo(() => computeBalances(todosGastos, trip.meta), [todosGastos, trip.meta])

  const porCategoria = useMemo(() => {
    const map = new Map<string, number>()
    for (const g of todosGastos) {
      const brl = toBRL(g.valor, g.moeda, trip.meta)
      map.set(g.categoria, (map.get(g.categoria) ?? 0) + brl)
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [todosGastos, trip.meta])

  const gastosOrdenados = useMemo(() => [...todosGastos].sort((a, b) => b.data.localeCompare(a.data)), [todosGastos])

  const orcamento = trip.meta.orcamentoBRL
  const pctOrcamento = orcamento ? Math.min(100, Math.round((balances.totalBRL / orcamento) * 100)) : null

  function openNew() {
    setEditing(undefined)
    setSheetOpen(true)
  }

  function openEdit(g: Gasto) {
    setEditing(g)
    setSheetOpen(true)
  }

  function handleSave(patch: Omit<Gasto, 'id'>) {
    if (editing) {
      dispatch({ type: 'gastos/update', id: editing.id, patch })
    } else {
      dispatch({ type: 'gastos/add', gasto: patch })
    }
  }

  function handleDelete() {
    if (editing) {
      dispatch({ type: 'gastos/remove', id: editing.id })
      setSheetOpen(false)
    }
  }

  function handleAcertarContas() {
    const settlement = buildSettlementGasto(balances, pessoas)
    if (settlement) dispatch({ type: 'gastos/add', gasto: settlement })
  }

  return (
    <div>
      <ScreenHeader
        title="Gastos"
        right={
          <button onClick={openNew} className="inline-flex items-center gap-xxs text-body-sm text-ink dark:text-on-dark active:opacity-70">
            <Plus size={16} /> Novo
          </button>
        }
      />

      <div className="px-lg py-base flex flex-col gap-lg">
        <Card className="bg-canvas-soft dark:bg-surface-dark-elevated">
          <p className="text-caption-upper text-muted dark:text-on-dark-soft">Total gasto</p>
          <div className="flex items-baseline justify-between">
            <p className="text-display-sm font-display text-ink dark:text-on-dark">
              <AnimatedNumber value={balances.totalBRL} format={formatBRL} />
            </p>
            {orcamento !== undefined && <p className="text-body-sm text-muted dark:text-on-dark-soft">de {formatBRL(orcamento)}</p>}
          </div>
          {pctOrcamento !== null && (
            <div className="mt-sm h-2 rounded-pill bg-surface-strong dark:bg-white/10 overflow-hidden">
              <motion.div
                className={`h-full rounded-pill ${pctOrcamento >= 100 ? 'bg-error' : 'bg-success'}`}
                initial={false}
                animate={{ width: `${pctOrcamento}%` }}
                transition={reduceMotion ? { duration: 0 } : { duration: duration.slow, ease: ease.out }}
              />
            </div>
          )}

          {balances.resumo && (
            <div className="mt-base flex items-center justify-between gap-sm">
              <p className="text-body-md text-ink dark:text-on-dark">{balances.resumo}</p>
              <Button size="sm" variant="outline" onClick={handleAcertarContas}>
                Acertar contas
              </Button>
            </div>
          )}
        </Card>

        <div>
          <h2 className="text-caption-upper text-muted dark:text-on-dark-soft mb-sm">Por pessoa</h2>
          <StaggerList className="grid grid-cols-2 gap-sm">
            {pessoas.map((p) => (
              <StaggerItem key={p}>
                <Card>
                  <div className="flex items-center gap-xs mb-xs">
                    <Avatar name={p} size={28} />
                    <p className="text-body-sm text-muted dark:text-on-dark-soft">{p}</p>
                  </div>
                  <p className="text-title-md font-sans text-ink dark:text-on-dark">
                    <AnimatedNumber value={balances.pago[p] ?? 0} format={formatBRL} />
                  </p>
                  <p className="text-caption text-muted dark:text-on-dark-soft">pagou · devia {formatBRL(balances.deveria[p] ?? 0)}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerList>
        </div>

        {porCategoria.length > 0 && (
          <div>
            <h2 className="text-caption-upper text-muted dark:text-on-dark-soft mb-sm">Por categoria</h2>
            <Card>
              <div className="flex flex-col divide-y divide-hairline dark:divide-hairline-dark">
                {porCategoria.map(([categoria, valor]) => (
                  <div key={categoria} className="flex items-center justify-between py-xs">
                    <span className="text-body-sm text-ink dark:text-on-dark">{categoria}</span>
                    <span className="text-body-sm text-muted dark:text-on-dark-soft">{formatBRL(valor)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        <div>
          <h2 className="text-caption-upper text-muted dark:text-on-dark-soft mb-sm">Lançamentos</h2>
          {gastosOrdenados.length === 0 ? (
            <p className="text-body-sm text-muted dark:text-on-dark-soft text-center py-xl">Nenhum gasto lançado ainda.</p>
          ) : (
            <Card>
              <StaggerList className="flex flex-col divide-y divide-hairline dark:divide-hairline-dark">
                {gastosOrdenados.map((g) => (
                  <StaggerItem key={g.id}>
                    <GastoRow gasto={g} onEdit={() => openEdit(g)} />
                  </StaggerItem>
                ))}
              </StaggerList>
            </Card>
          )}
        </div>
      </div>

      <GastoEditorSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        gasto={editing}
        pessoas={pessoas}
        onSave={handleSave}
        onDelete={editing ? handleDelete : undefined}
      />
    </div>
  )
}
