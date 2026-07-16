import { useState } from 'react'
import { BottomSheet } from '../../components/ui/BottomSheet'
import { Button } from '../../components/ui/Button'
import { supabase } from '../../lib/supabase'
import { useTrip } from '../../store/TripContext'

export function ShareTripSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { tripId, trip } = useTrip()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    setLoading(true)
    setError(null)
    setCopied(false)
    const { data, error: insertError } = await supabase
      .from('trip_invites')
      .insert({ trip_id: tripId })
      .select('token')
      .single()
    setLoading(false)
    if (insertError || !data) {
      setError('Não foi possível gerar o convite. Tenta de novo.')
      return
    }

    const url = `${window.location.origin}/invite/${data.token}`
    const shareData = {
      title: `Convite: ${trip.meta.titulo}`,
      text: `Bora planejar ${trip.meta.destino} juntos no Tripper!`,
      url,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // usuário cancelou o compartilhamento — sem erro
      }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Convidar pra viagem">
      <p className="text-body-md text-muted dark:text-on-dark-soft mb-base">
        Gera um link de convite pra <strong>{trip.meta.titulo}</strong>. Quem abrir o link entra (ou cria conta) e passa a
        ver e editar essa viagem com você, em tempo real.
      </p>
      <Button onClick={handleShare} fullWidth disabled={loading}>
        {loading ? 'Gerando link…' : 'Compartilhar link de convite'}
      </Button>
      {copied && <p className="mt-sm text-body-sm text-success text-center">Link copiado!</p>}
      {error && <p className="mt-sm text-body-sm text-error text-center">{error}</p>}
    </BottomSheet>
  )
}
