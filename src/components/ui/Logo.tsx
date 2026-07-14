function Mark({ size = 28, light = false }: { size?: number; light?: boolean }) {
  if (light) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="9" className="fill-white/15" stroke="white" strokeOpacity="0.5" />
        <circle cx="16" cy="16" r="9" stroke="white" strokeWidth="1.6" fill="none" />
        <circle cx="16" cy="16" r="1.4" fill="white" />
        <path d="M16 16 L20.5 10.5 L18 15 Z" fill="white" />
        <path d="M16 16 L11.5 21.5 L14 17 Z" fill="white" opacity="0.6" />
      </svg>
    )
  }

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="9" className="fill-ink dark:fill-white" />
      <circle cx="16" cy="16" r="9" className="stroke-canvas dark:stroke-surface-dark" strokeWidth="1.6" fill="none" />
      <circle cx="16" cy="16" r="1.4" className="fill-canvas dark:fill-surface-dark" />
      <path d="M16 16 L20.5 10.5 L18 15 Z" className="fill-canvas dark:fill-surface-dark" />
      <path d="M16 16 L11.5 21.5 L14 17 Z" className="fill-gradient-peach dark:fill-gradient-peach" opacity="0.9" />
    </svg>
  )
}

export function Logo({
  size = 'md',
  variant = 'default',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'light'
  className?: string
}) {
  const markSize = size === 'lg' ? 36 : size === 'sm' ? 22 : 28
  const textSize = size === 'lg' ? 'text-title-md' : size === 'sm' ? 'text-body-sm' : 'text-title-sm'

  return (
    <div className={`inline-flex items-center gap-xs ${className}`}>
      <Mark size={markSize} light={variant === 'light'} />
      <span className={`${textSize} font-semibold tracking-tight ${variant === 'light' ? 'text-white' : 'text-ink dark:text-on-dark'}`}>
        Tripper
      </span>
    </div>
  )
}
