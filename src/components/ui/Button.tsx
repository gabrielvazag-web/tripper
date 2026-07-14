import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'text'
type Size = 'md' | 'sm'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  fullWidth?: boolean
}

const base =
  'inline-flex items-center justify-center gap-xs font-sans text-button rounded-pill transition-colors active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-on-primary active:bg-primary-active dark:bg-white dark:text-ink',
  outline: 'bg-transparent text-ink border border-hairline-strong active:bg-surface-strong dark:text-on-dark dark:border-hairline-dark-strong dark:active:bg-surface-dark-elevated',
  text: 'bg-transparent text-ink px-0 dark:text-on-dark',
}

const sizes: Record<Size, string> = {
  md: 'h-10 px-lg',
  sm: 'h-9 px-base text-body-sm',
}

export function Button({ variant = 'primary', size = 'md', icon, fullWidth, className = '', children, ...rest }: Props) {
  return (
    <button
      className={`${base} ${variants[variant]} ${variant !== 'text' ? sizes[size] : ''} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
