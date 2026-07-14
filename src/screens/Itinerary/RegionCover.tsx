import { Binoculars, Car, Compass, Mountain, PawPrint, Plane, TreePine } from 'lucide-react'

type Theme = { icon: typeof Mountain; from: string; to: string; photo?: string }

const THEMES: { match: RegExp; theme: Theme }[] = [
  { match: /cabo|table/i, theme: { icon: Mountain, from: '#a8c8e8', to: '#c8b8e0', photo: '/photos/cidade-do-cabo.jpg' } },
  {
    match: /garden|knysna|wilderness|plett|tsitsikamma|hermanus/i,
    theme: { icon: TreePine, from: '#a7e5d3', to: '#a8c8e8', photo: '/photos/garden-route.jpg' },
  },
  { match: /kruger|tulani|safári|safari|grietjie/i, theme: { icon: PawPrint, from: '#f4c5a8', to: '#e8b8c4', photo: '/photos/kruger.jpg' } },
  {
    match: /panorama|canyon|graskop|blyde|hazyview/i,
    theme: { icon: Binoculars, from: '#c8b8e0', to: '#f4c5a8', photo: '/photos/panorama-route.jpg' },
  },
  { match: /trânsito|transito|estrada|gqeberha/i, theme: { icon: Car, from: '#d6d3d1', to: '#a8a29e' } },
  { match: /volta|joanesburgo|joburg|hoedspruit/i, theme: { icon: Plane, from: '#a8c8e8', to: '#fafafa', photo: '/photos/volta.jpg' } },
]

function pickTheme(base: string): Theme {
  const hit = THEMES.find(({ match }) => match.test(base))
  if (hit) return hit.theme
  // fallback determinístico pra bases customizadas sem foto: cor derivada do nome, ícone genérico
  let hash = 0
  for (let i = 0; i < base.length; i++) hash = (hash * 31 + base.charCodeAt(i)) % 360
  return { icon: Compass, from: `hsl(${hash}, 45%, 82%)`, to: `hsl(${(hash + 40) % 360}, 45%, 88%)` }
}

/**
 * Capa por região: usa foto real (Wikimedia Commons, licença livre) quando
 * disponível pro lugar; cai numa ilustração de gradiente + ícone quando não
 * há foto (ex.: dias de trânsito) ou pra bases customizadas criadas pelo usuário.
 */
export function RegionCover({ base, className = '', iconSize = 40 }: { base: string; className?: string; iconSize?: number }) {
  const { icon: Icon, from, to, photo } = pickTheme(base)

  if (photo) {
    return (
      <div className={className}>
        <img src={photo} alt={base} className="w-full h-full object-cover" loading="lazy" />
      </div>
    )
  }

  return (
    <div className={className} style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
      <Icon size={iconSize} strokeWidth={1.5} className="text-ink/70" />
    </div>
  )
}
