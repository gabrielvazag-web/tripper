import { useState } from 'react'
import { useTheme } from './lib/useTheme'
import { WelcomeScreen } from './screens/Welcome/WelcomeScreen'
import { MyTripsScreen } from './screens/MyTrips/MyTripsScreen'
import { TripShell } from './TripShell'

type RootScreen = 'welcome' | 'minhas-viagens' | 'trip'

export default function App() {
  useTheme()
  const [screen, setScreen] = useState<RootScreen>('welcome')

  if (screen === 'trip') {
    return <TripShell />
  }

  if (screen === 'minhas-viagens') {
    return <MyTripsScreen onBack={() => setScreen('welcome')} onOpenTrip={() => setScreen('trip')} />
  }

  return (
    <WelcomeScreen
      onMinhasViagens={() => setScreen('minhas-viagens')}
      onNovaViagem={() => {
        /* em construção — por enquanto o app guarda só a viagem da África do Sul */
      }}
    />
  )
}
