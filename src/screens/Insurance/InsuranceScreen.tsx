import { Phone } from 'lucide-react'
import { useTrip } from '../../store/TripContext'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { Card } from '../../components/ui/Card'
import { TextField, TextAreaField } from '../../components/ui/Field'
import { AttachmentField } from '../../components/ui/AttachmentField'
import type { Seguro } from '../../types/trip'

export function InsuranceScreen({ onBack }: { onBack: () => void }) {
  const { trip, dispatch } = useTrip()
  const seguro = trip.seguro ?? {}

  function update(patch: Partial<Seguro>) {
    dispatch({ type: 'seguro/update', patch })
  }

  return (
    <div>
      <ScreenHeader title="Seguro viagem" onBack={onBack} />

      <div className="px-lg py-base flex flex-col gap-base">
        {seguro.telefoneEmergencia && (
          <Card className="bg-canvas-soft dark:bg-surface-dark-elevated">
            <p className="text-caption-upper text-muted dark:text-on-dark-soft mb-xs">Emergência</p>
            <a
              href={`tel:${seguro.telefoneEmergencia}`}
              className="inline-flex items-center gap-sm text-title-md font-sans text-ink dark:text-on-dark"
            >
              <Phone size={20} /> {seguro.telefoneEmergencia}
            </a>
          </Card>
        )}

        <Card className="flex flex-col gap-base">
          <TextField label="Seguradora" value={seguro.seguradora ?? ''} onChange={(e) => update({ seguradora: e.target.value })} />
          <TextField label="Número da apólice" value={seguro.apolice ?? ''} onChange={(e) => update({ apolice: e.target.value })} />
          <TextField label="Vigência" value={seguro.vigencia ?? ''} onChange={(e) => update({ vigencia: e.target.value })} placeholder="Ex.: 14/08/2026 a 29/08/2026" />
          <TextField
            label="Telefone de emergência"
            type="tel"
            value={seguro.telefoneEmergencia ?? ''}
            onChange={(e) => update({ telefoneEmergencia: e.target.value })}
          />
          <TextAreaField label="Cobertura" value={seguro.cobertura ?? ''} onChange={(e) => update({ cobertura: e.target.value })} />
          <TextAreaField label="Notas" value={seguro.notas ?? ''} onChange={(e) => update({ notas: e.target.value })} />
          <AttachmentField imageId={seguro.imagemId} onChange={(imagemId) => update({ imagemId })} />
        </Card>
      </div>
    </div>
  )
}
