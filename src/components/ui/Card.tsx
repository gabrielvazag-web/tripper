import type { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  padded?: boolean
}

export function Card({ padded = true, className = '', children, ...rest }: Props) {
  return (
    <div
      className={`bg-surface-card border border-hairline rounded-xl dark:bg-surface-dark-elevated dark:border-hairline-dark ${padded ? 'p-lg' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
