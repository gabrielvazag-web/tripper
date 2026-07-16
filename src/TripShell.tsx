import { useState } from 'react'
import { TabBar } from './components/layout/TabBar'
import { HomeScreen } from './screens/Home/HomeScreen'
import { ItineraryScreen } from './screens/Itinerary/ItineraryScreen'
import { ReservationsScreen } from './screens/Reservations/ReservationsScreen'
import { ExpensesScreen } from './screens/Expenses/ExpensesScreen'
import { MoreScreen } from './screens/More/MoreScreen'
import { ChecklistsScreen } from './screens/Checklists/ChecklistsScreen'
import { InsuranceScreen } from './screens/Insurance/InsuranceScreen'
import { TipsScreen } from './screens/Tips/TipsScreen'
import { NotesScreen } from './screens/Notes/NotesScreen'
import { SettingsScreen } from './screens/Settings/SettingsScreen'

export type TabKey = 'inicio' | 'roteiro' | 'reservas' | 'gastos' | 'mais'
export type MoreKey = 'menu' | 'seguro' | 'checklists' | 'dicas' | 'notas' | 'config'

/** O app de abas de uma viagem específica (Início/Roteiro/Reservas/Gastos/Mais). */
export function TripShell({ onExitTrip }: { onExitTrip: () => void }) {
  const [tab, setTab] = useState<TabKey>('inicio')
  const [morePage, setMorePage] = useState<MoreKey>('menu')

  function handleTabChange(next: TabKey, more: MoreKey = 'menu') {
    setTab(next)
    if (next === 'mais') setMorePage(more)
  }

  function goToMorePage(page: MoreKey) {
    setMorePage(page)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main key={`${tab}-${morePage}`} className="flex-1 max-w-lg w-full mx-auto pb-24 animate-fade-in">
        {tab === 'inicio' && <HomeScreen onNavigate={handleTabChange} />}
        {tab === 'roteiro' && <ItineraryScreen />}
        {tab === 'reservas' && <ReservationsScreen />}
        {tab === 'gastos' && <ExpensesScreen />}
        {tab === 'mais' && morePage === 'menu' && <MoreScreen onNavigate={goToMorePage} />}
        {tab === 'mais' && morePage === 'seguro' && <InsuranceScreen onBack={() => goToMorePage('menu')} />}
        {tab === 'mais' && morePage === 'checklists' && <ChecklistsScreen onBack={() => goToMorePage('menu')} />}
        {tab === 'mais' && morePage === 'dicas' && <TipsScreen onBack={() => goToMorePage('menu')} />}
        {tab === 'mais' && morePage === 'notas' && <NotesScreen onBack={() => goToMorePage('menu')} />}
        {tab === 'mais' && morePage === 'config' && (
          <SettingsScreen onBack={() => goToMorePage('menu')} onExitTrip={onExitTrip} />
        )}
      </main>
      <TabBar active={tab} onChange={handleTabChange} />
    </div>
  )
}
