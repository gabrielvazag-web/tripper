import { useEffect, useState } from 'react'
import { useTheme } from './lib/useTheme'
import { useAuth } from './store/AuthContext'
import { TripProvider } from './store/TripContext'
import { supabase } from './lib/supabase'
import { LoginScreen } from './screens/Auth/LoginScreen'
import { WelcomeScreen } from './screens/Welcome/WelcomeScreen'
import { MyTripsScreen } from './screens/MyTrips/MyTripsScreen'
import { FirstTripScreen } from './screens/MyTrips/FirstTripScreen'
import { Logo } from './components/ui/Logo'
import { TripShell } from './TripShell'
import type { Trip } from './types/trip'

type RootScreen = 'loading' | 'login' | 'onboarding-create' | 'welcome' | 'minhas-viagens' | 'trip'
type InvitePreview = { destino: string; titulo: string } | null

const LOCAL_TRIP_KEY = 'africatrip:trip:v1'

function parseInviteToken(): string | null {
  const match = window.location.pathname.match(/^\/invite\/([0-9a-f-]{36})$/i)
  return match ? match[1] : null
}

export default function App() {
  useTheme()
  const { session, loading: authLoading } = useAuth()
  const [inviteToken] = useState(parseInviteToken)
  const [invitePreview, setInvitePreview] = useState<InvitePreview>(null)
  const [screen, setScreen] = useState<RootScreen>('loading')
  const [activeTrip, setActiveTrip] = useState<{ id: string; data: Trip } | null>(null)

  useEffect(() => {
    if (!inviteToken || session) return
    supabase.rpc('get_invite_preview', { invite_token: inviteToken }).then(({ data }) => {
      const row = (data as InvitePreview[] | null)?.[0]
      if (row) setInvitePreview(row)
    })
  }, [inviteToken, session])

  useEffect(() => {
    if (authLoading) return
    if (!session) {
      setScreen('login')
      return
    }

    let cancelled = false

    async function decide() {
      if (inviteToken) {
        const { data: redeemedTripId, error } = await supabase.rpc('redeem_invite', { invite_token: inviteToken })
        window.history.replaceState({}, '', '/')
        if (!error && redeemedTripId) {
          const { data: row } = await supabase.from('trips').select('data').eq('id', redeemedTripId).single()
          if (!cancelled && row) {
            setActiveTrip({ id: redeemedTripId as string, data: row.data as Trip })
            setScreen('trip')
            return
          }
        }
      }

      const { data: existing } = await supabase.from('trips').select('id').limit(1)
      if (cancelled) return

      if (!existing || existing.length === 0) {
        const localRaw = localStorage.getItem(LOCAL_TRIP_KEY)
        if (localRaw) {
          try {
            const localTrip = JSON.parse(localRaw) as Trip
            const { data: newId } = await supabase.rpc('create_trip', { trip_data: localTrip })
            if (!cancelled && newId) {
              setActiveTrip({ id: newId as string, data: localTrip })
              setScreen('trip')
              return
            }
          } catch {
            // localStorage corrompido — segue pro fluxo normal de criação
          }
        }
        setScreen('onboarding-create')
        return
      }

      setScreen('welcome')
    }

    decide()
    return () => {
      cancelled = true
    }
  }, [session, authLoading, inviteToken])

  if (screen === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas dark:bg-surface-dark">
        <Logo size="lg" />
      </div>
    )
  }

  if (screen === 'login') {
    return <LoginScreen invitePreview={invitePreview} />
  }

  if (screen === 'onboarding-create') {
    return (
      <FirstTripScreen
        onCreated={(id, data) => {
          setActiveTrip({ id, data })
          setScreen('trip')
        }}
      />
    )
  }

  if (screen === 'trip' && activeTrip) {
    return (
      <TripProvider tripId={activeTrip.id} initialTrip={activeTrip.data}>
        <TripShell
          onExitTrip={() => {
            setActiveTrip(null)
            setScreen('welcome')
          }}
        />
      </TripProvider>
    )
  }

  if (screen === 'minhas-viagens') {
    return (
      <MyTripsScreen
        onBack={() => setScreen('welcome')}
        onOpenTrip={(id, data) => {
          setActiveTrip({ id, data })
          setScreen('trip')
        }}
      />
    )
  }

  return <WelcomeScreen onMinhasViagens={() => setScreen('minhas-viagens')} onNovaViagem={() => setScreen('minhas-viagens')} />
}
