import { useState } from 'react'
import { BookMarked, Eye, EyeOff, ListChecks, Wallet } from 'lucide-react'
import { useTrip } from '../../store/TripContext'
import { Card } from '../../components/ui/Card'
import { Chip } from '../../components/ui/Chip'
import { Logo } from '../../components/ui/Logo'
import { MapLink } from '../../components/ui/MapLink'
import type { TabKey, MoreKey } from '../../TripShell'
import { formatDateBR, findHojeEProximo, getCountdownOrDayNumber, todayAtMidnight } from '../../lib/date'
import { computeBalances, formatBRL } from '../../lib/money'
import { getTodosGastos } from '../../lib/reservaGastos'

export function HomeScreen({ onNavigate }: { onNavigate: (tab: TabKey, more?: MoreKey) => void }) {
  const { trip } = useTrip()
  const [gastosOcultos, setGastosOcultos] = useState(true)
  const today = todayAtMidnight()
  const countdown = getCountdownOrDayNumber(trip.meta.inicio, trip.meta.fim, today)
  const { hoje, proximo } = findHojeEProximo(trip.itinerario, today)
  const balances = computeBalances(getTodosGastos(trip), trip.meta)

  const listaDeHoje = trip.checklists.find((l) => l.grupo === 'mala') ?? trip.checklists[0]
  const feitosHoje = listaDeHoje?.itens.filter((i) => i.feito).length ?? 0
  const totalHoje = listaDeHoje?.itens.length ?? 0

  return (
    <div className="flex flex-col gap-lg safe-top pb-lg">
      <div className="px-lg pt-lg">
        <Logo size="lg" />
      </div>

      <div className="px-lg animate-fade-in-up">
        <div className="relative rounded-xxl overflow-hidden h-40 shadow-soft">
          <img
            src="/photos/unforgettable-time-with-african-iphone-dtk4exogcjs4z3ha.jpg"
            alt={trip.meta.destino}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-base">
            <p className="text-title-md font-semibold text-white">{trip.meta.destino}</p>
            <p className="text-body-sm text-white/85">
              {formatDateBR(trip.meta.inicio)} – {formatDateBR(trip.meta.fim)}
            </p>
          </div>
        </div>

        {countdown.phase !== 'antes' && (
          <div className="mt-sm">
            {countdown.phase === 'durante' && (
              <Chip tone="success">
                Dia {countdown.diaAtual} de {countdown.totalDias}
              </Chip>
            )}
            {countdown.phase === 'depois' && <Chip tone="neutral">Viagem concluída — boas lembranças!</Chip>}
          </div>
        )}
      </div>

      <div className="px-lg animate-fade-in-up" style={{ animationDelay: '60ms' }}>
        <h2 className="text-caption-upper text-muted dark:text-on-dark-soft mb-sm">Agora / a seguir</h2>
        <div className="flex flex-col gap-sm">
          <Card>
            <Chip tone="neutral">Hoje</Chip>
            {hoje ? (
              <>
                <p className="text-title-sm font-sans text-ink dark:text-on-dark mt-xs">{hoje.titulo}</p>
                <p className="text-body-sm text-muted dark:text-on-dark-soft">{hoje.base} · {hoje.descricao}</p>
                <div className="mt-sm">
                  <MapLink query={`${hoje.titulo}, ${hoje.base}`} />
                </div>
              </>
            ) : (
              <p className="text-body-sm text-muted dark:text-on-dark-soft mt-xs">Nada agendado pra hoje no roteiro.</p>
            )}
          </Card>
          <Card>
            <Chip tone="neutral">A seguir</Chip>
            {proximo ? (
              <>
                <p className="text-title-sm font-sans text-ink dark:text-on-dark mt-xs">{proximo.titulo}</p>
                <p className="text-body-sm text-muted dark:text-on-dark-soft">{formatDateBR(proximo.data)} · {proximo.base}</p>
                <div className="mt-sm">
                  <MapLink query={`${proximo.titulo}, ${proximo.base}`} />
                </div>
              </>
            ) : (
              <p className="text-body-sm text-muted dark:text-on-dark-soft mt-xs">Nenhum próximo compromisso.</p>
            )}
          </Card>
        </div>
      </div>

      <div className="px-lg animate-fade-in-up" style={{ animationDelay: '120ms' }}>
        <h2 className="text-caption-upper text-muted dark:text-on-dark-soft mb-sm">Atalhos</h2>
        <div className="grid grid-cols-3 gap-sm">
          <ShortcutButton icon={BookMarked} label="Reservas" onClick={() => onNavigate('reservas')} />
          <ShortcutButton icon={Wallet} label="Gastos" onClick={() => onNavigate('gastos')} />
          <ShortcutButton
            icon={ListChecks}
            label={listaDeHoje ? `Checklist${totalHoje ? ` ${feitosHoje}/${totalHoje}` : ''}` : 'Checklist'}
            onClick={() => onNavigate('mais', 'checklists')}
          />
        </div>
      </div>

      <div className="px-lg animate-fade-in-up" style={{ animationDelay: '180ms' }}>
        <Card>
          <div className="flex items-center justify-between mb-sm">
            <h2 className="text-caption-upper text-muted dark:text-on-dark-soft">Gastos</h2>
            <button
              onClick={() => setGastosOcultos((v) => !v)}
              className="p-xxs -mr-xxs rounded-full active:bg-surface-strong dark:active:bg-white/10"
              aria-label={gastosOcultos ? 'Mostrar valores' : 'Ocultar valores'}
            >
              {gastosOcultos ? (
                <EyeOff size={16} className="text-muted dark:text-on-dark-soft" />
              ) : (
                <Eye size={16} className="text-muted dark:text-on-dark-soft" />
              )}
            </button>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-display-sm font-display text-ink dark:text-on-dark">
              {gastosOcultos ? '••••••' : formatBRL(balances.totalBRL)}
            </p>
            {trip.meta.orcamentoBRL !== undefined && (
              <p className="text-body-sm text-muted dark:text-on-dark-soft">
                de {gastosOcultos ? '••••' : formatBRL(trip.meta.orcamentoBRL)}
              </p>
            )}
          </div>
          {balances.resumo && (
            <p className="mt-sm text-body-sm text-ink dark:text-on-dark">{gastosOcultos ? 'Toque no olho pra ver o saldo' : balances.resumo}</p>
          )}
        </Card>
      </div>
    </div>
  )
}

function ShortcutButton({ icon: Icon, label, onClick }: { icon: typeof Wallet; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-xs py-base rounded-xl border border-hairline bg-surface-card dark:bg-surface-dark-elevated dark:border-hairline-dark active:bg-surface-strong dark:active:bg-white/5 active:scale-[0.97] transition-transform"
    >
      <Icon size={20} className="text-ink dark:text-on-dark" />
      <span className="text-caption text-ink dark:text-on-dark text-center leading-tight">{label}</span>
    </button>
  )
}
