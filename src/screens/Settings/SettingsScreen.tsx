import { useRef, useState } from 'react'
import { Download, Upload } from 'lucide-react'
import { useTrip } from '../../store/TripContext'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { Card } from '../../components/ui/Card'
import { TextField } from '../../components/ui/Field'
import { Button } from '../../components/ui/Button'
import { useTheme } from '../../lib/useTheme'
import type { ThemePref } from '../../lib/theme'
import type { Trip } from '../../types/trip'

const THEME_OPTIONS: { value: ThemePref; label: string }[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
  { value: 'system', label: 'Sistema' },
]

const CREDITOS_FOTOS = [
  { lugar: 'Cidade do Cabo', autor: 'Danie van der Merwe', licenca: 'CC BY 2.0' },
  { lugar: 'Garden Route (Knysna)', autor: 'Terence27', licenca: 'CC BY-SA 4.0' },
  { lugar: 'Kruger', autor: 'Nithin bolar k', licenca: 'CC BY-SA 3.0' },
  { lugar: 'Panorama Route (Blyde River Canyon)', autor: 'Claudirene', licenca: 'CC BY-SA 3.0' },
  { lugar: 'Volta (Joanesburgo)', autor: 'Mark Hillary', licenca: 'CC BY 2.0' },
]

function isValidTrip(data: unknown): data is Trip {
  if (!data || typeof data !== 'object') return false
  const t = data as Partial<Trip>
  return Boolean(t.meta && Array.isArray(t.itinerario) && Array.isArray(t.reservas) && Array.isArray(t.checklists) && Array.isArray(t.gastos))
}

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const { trip, dispatch } = useTrip()
  const { pref, setPref } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [importOk, setImportOk] = useState(false)

  function handleExport() {
    const blob = new Blob([JSON.stringify(trip, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `viagem-africa-do-sul-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportClick() {
    setImportError(null)
    setImportOk(false)
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      if (!isValidTrip(data)) {
        setImportError('Arquivo inválido: não parece um backup desta viagem.')
        return
      }
      dispatch({ type: 'trip/replace', trip: data })
      setImportOk(true)
      setImportError(null)
    } catch {
      setImportError('Não foi possível ler o arquivo. Confirme que é um JSON exportado por este app.')
    }
  }

  return (
    <div>
      <ScreenHeader title="Configurações" onBack={onBack} />

      <div className="px-lg py-base flex flex-col gap-lg">
        <div>
          <h2 className="text-caption-upper text-muted dark:text-on-dark-soft mb-sm">Aparência</h2>
          <Card padded={false} className="flex overflow-hidden">
            {THEME_OPTIONS.map((opt, i) => (
              <button
                key={opt.value}
                onClick={() => setPref(opt.value)}
                className={`flex-1 py-sm text-body-sm text-center ${i > 0 ? 'border-l border-hairline dark:border-hairline-dark' : ''} ${
                  pref === opt.value ? 'bg-primary text-on-primary dark:bg-white dark:text-ink' : 'text-ink dark:text-on-dark'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </Card>
        </div>

        <div>
          <h2 className="text-caption-upper text-muted dark:text-on-dark-soft mb-sm">Câmbio e orçamento</h2>
          <Card className="flex flex-col gap-base">
            <TextField
              label="Câmbio ZAR → BRL"
              type="number"
              step="0.01"
              value={trip.meta.cambioZARtoBRL}
              onChange={(e) => dispatch({ type: 'meta/update', patch: { cambioZARtoBRL: Number(e.target.value) || 0 } })}
            />
            <TextField
              label="Câmbio USD → BRL"
              type="number"
              step="0.01"
              value={trip.meta.cambioUSDtoBRL}
              onChange={(e) => dispatch({ type: 'meta/update', patch: { cambioUSDtoBRL: Number(e.target.value) || 0 } })}
            />
            <TextField
              label="Orçamento total (BRL)"
              type="number"
              step="1"
              value={trip.meta.orcamentoBRL ?? ''}
              onChange={(e) => dispatch({ type: 'meta/update', patch: { orcamentoBRL: e.target.value ? Number(e.target.value) : undefined } })}
            />
          </Card>
        </div>

        <div>
          <h2 className="text-caption-upper text-muted dark:text-on-dark-soft mb-sm">Backup</h2>
          <div className="flex flex-col gap-sm">
            <Button variant="outline" icon={<Download size={16} />} onClick={handleExport}>
              Exportar dados (JSON)
            </Button>
            <Button variant="outline" icon={<Upload size={16} />} onClick={handleImportClick}>
              Importar dados (JSON)
            </Button>
            <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />
            {importError && <p className="text-body-sm text-error">{importError}</p>}
            {importOk && <p className="text-body-sm text-success">Dados importados com sucesso.</p>}
          </div>
        </div>

        <div>
          <h2 className="text-caption-upper text-muted dark:text-on-dark-soft mb-sm">Créditos das fotos</h2>
          <Card>
            <p className="text-body-sm text-muted dark:text-on-dark-soft mb-sm">
              Capas do roteiro via Wikimedia Commons, sob licença Creative Commons:
            </p>
            <div className="flex flex-col gap-xs">
              {CREDITOS_FOTOS.map((c) => (
                <p key={c.lugar} className="text-caption text-body dark:text-on-dark-soft">
                  {c.lugar}: {c.autor} ({c.licenca})
                </p>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
