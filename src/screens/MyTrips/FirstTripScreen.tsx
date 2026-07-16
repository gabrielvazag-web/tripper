import { useState } from 'react'
import { Logo } from '../../components/ui/Logo'
import { Button } from '../../components/ui/Button'
import { CreateTripSheet } from './CreateTripSheet'
import type { Trip } from '../../types/trip'

export function FirstTripScreen({ onCreated }: { onCreated: (tripId: string, trip: Trip) => void }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="min-h-screen flex flex-col safe-top safe-bottom px-lg bg-canvas dark:bg-surface-dark">
      <div className="pt-lg">
        <Logo size="lg" />
      </div>
      <div className="flex-1 flex flex-col justify-center gap-base">
        <h1 className="text-display-sm font-display font-bold text-ink dark:text-on-dark">
          Vamos criar sua primeira viagem
        </h1>
        <p className="text-body-md text-muted dark:text-on-dark-soft">
          Depois de criada, você pode convidar quem for viajar junto direto das Configurações — a pessoa entra pelo link e
          passa a ver e editar tudo com você.
        </p>
        <Button onClick={() => setOpen(true)} fullWidth>
          Criar viagem
        </Button>
      </div>

      <CreateTripSheet open={open} onClose={() => setOpen(false)} onCreated={onCreated} />
    </div>
  )
}
