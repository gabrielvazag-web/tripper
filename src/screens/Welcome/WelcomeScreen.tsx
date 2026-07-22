import { Logo } from '../../components/ui/Logo'
import { Button } from '../../components/ui/Button'

export function WelcomeScreen({
  onMinhasViagens,
  onNovaViagem,
}: {
  onMinhasViagens: () => void
  onNovaViagem: () => void
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/hero-africa.mp4"
        poster="/photos/unforgettable-time-with-african-iphone-dtk4exogcjs4z3ha.jpg"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/10" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="safe-top px-lg pt-lg">
          <Logo size="lg" variant="light" />
        </div>

        <div className="flex-1" />

        <div className="rounded-t-[32px] bg-black/70 backdrop-blur-md px-lg pt-xl safe-bottom">
          <h1 className="text-display-md font-display font-bold text-white leading-tight">Bem-vindo ao Tripper</h1>
          <p className="mt-sm text-body-md text-white/75">
            Seu posto de comando de viagem — roteiro, reservas e gastos num só lugar, do planejamento ao embarque.
          </p>

          <div className="flex flex-col gap-sm mt-xl pb-xl">
            <Button onClick={onMinhasViagens} fullWidth>
              Minhas viagens
            </Button>
            <button
              onClick={onNovaViagem}
              className="w-full h-10 rounded-pill border border-white/40 text-button text-white active:bg-white/10 transition-colors"
            >
              Nova viagem
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
