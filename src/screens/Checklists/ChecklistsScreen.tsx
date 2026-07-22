import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useTrip } from '../../store/TripContext'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { StaggerList, StaggerItem } from '../../components/ui/Stagger'
import { Accordion } from '../../components/ui/Accordion'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { Checkbox } from '../../components/ui/Checkbox'
import { TextField, SelectField } from '../../components/ui/Field'
import { Button } from '../../components/ui/Button'
import { BottomSheet } from '../../components/ui/BottomSheet'
import type { Checklist } from '../../types/trip'

const GRUPO_LABELS: Record<Checklist['grupo'], string> = {
  mala: 'Mala',
  reservas: 'Reservas',
  documentos: 'Documentos',
  outro: 'Outro',
}

export function ChecklistsScreen({ onBack }: { onBack: () => void }) {
  const { trip, dispatch } = useTrip()
  const [novoItemPorLista, setNovoItemPorLista] = useState<Record<string, string>>({})
  const [novaListaOpen, setNovaListaOpen] = useState(false)

  function handleAddItem(listId: string) {
    const texto = (novoItemPorLista[listId] ?? '').trim()
    if (!texto) return
    dispatch({ type: 'checklists/addItem', listId, texto })
    setNovoItemPorLista((s) => ({ ...s, [listId]: '' }))
  }

  return (
    <div>
      <ScreenHeader title="Checklists" onBack={onBack} />

      <StaggerList className="px-lg py-base flex flex-col gap-sm">
        {trip.checklists.map((lista) => {
          const feitos = lista.itens.filter((i) => i.feito).length
          return (
            <StaggerItem key={lista.id}>
            <Accordion
              title={lista.titulo}
              subtitle={GRUPO_LABELS[lista.grupo]}
              defaultOpen
              headerRight={
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Excluir a lista "${lista.titulo}"?`)) dispatch({ type: 'checklists/removeList', id: lista.id })
                  }}
                  className="p-xs -mr-xs active:opacity-60"
                  aria-label="Excluir lista"
                >
                  <Trash2 size={16} className="text-muted-soft" />
                </button>
              }
            >
              <div className="mb-base">
                <ProgressBar value={feitos} total={lista.itens.length} />
              </div>

              <div className="flex flex-col divide-y divide-hairline dark:divide-hairline-dark">
                {lista.itens.map((item) => (
                  <div key={item.id} className="flex items-center gap-xs">
                    <div className="flex-1">
                      <Checkbox
                        checked={item.feito}
                        onChange={() =>
                          dispatch({
                            type: 'checklists/updateItem',
                            listId: lista.id,
                            itemId: item.id,
                            patch: { feito: !item.feito },
                          })
                        }
                        label={item.texto}
                      />
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'checklists/removeItem', listId: lista.id, itemId: item.id })}
                      className="p-xs active:opacity-60"
                      aria-label="Excluir item"
                    >
                      <Trash2 size={14} className="text-muted-soft" />
                    </button>
                  </div>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleAddItem(lista.id)
                }}
                className="flex gap-xs mt-base"
              >
                <input
                  value={novoItemPorLista[lista.id] ?? ''}
                  onChange={(e) => setNovoItemPorLista((s) => ({ ...s, [lista.id]: e.target.value }))}
                  placeholder="Novo item"
                  className="flex-1 h-10 px-base rounded-md border border-hairline-strong bg-surface-card text-body-sm text-ink placeholder:text-muted-soft focus:outline-none focus:border-2 focus:border-ink dark:bg-surface-dark-elevated dark:text-on-dark dark:border-hairline-dark-strong"
                />
                <Button type="submit" size="sm" icon={<Plus size={16} />} />
              </form>
            </Accordion>
            </StaggerItem>
          )
        })}

        <button
          onClick={() => setNovaListaOpen(true)}
          className="flex items-center justify-center gap-xs h-12 rounded-xl border border-dashed border-hairline-strong dark:border-hairline-dark-strong text-body-md text-muted dark:text-on-dark-soft active:bg-surface-strong dark:active:bg-white/5"
        >
          <Plus size={18} /> Nova lista
        </button>
      </StaggerList>

      <NovaListaSheet open={novaListaOpen} onClose={() => setNovaListaOpen(false)} />
    </div>
  )
}

function NovaListaSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dispatch } = useTrip()
  const [titulo, setTitulo] = useState('')
  const [grupo, setGrupo] = useState<Checklist['grupo']>('outro')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!titulo.trim()) return
    dispatch({ type: 'checklists/addList', titulo: titulo.trim(), grupo })
    setTitulo('')
    setGrupo('outro')
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Nova lista">
      <form onSubmit={handleSubmit} className="flex flex-col gap-base">
        <TextField label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Antes de embarcar" required />
        <SelectField label="Grupo" value={grupo} onChange={(e) => setGrupo(e.target.value as Checklist['grupo'])}>
          {Object.entries(GRUPO_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </SelectField>
        <Button type="submit">Criar lista</Button>
      </form>
    </BottomSheet>
  )
}
