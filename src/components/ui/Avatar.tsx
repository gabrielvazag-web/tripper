const PALETTE = ['bg-gradient-sky', 'bg-gradient-peach', 'bg-gradient-lavender', 'bg-gradient-mint', 'bg-gradient-rose']

function colorFor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % PALETTE.length
  return PALETTE[hash]
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initial = name.trim().charAt(0).toUpperCase()
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 rounded-full font-semibold text-ink ${colorFor(name)}`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {initial}
    </span>
  )
}
