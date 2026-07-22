import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { popIn } from '../../lib/motion'

type Tone = 'success' | 'warning' | 'neutral'

const tones: Record<Tone, string> = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  neutral: 'bg-surface-strong text-ink dark:bg-white/10 dark:text-on-dark',
}

export function Chip({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.span
      className={`inline-flex items-center shrink-0 whitespace-nowrap px-sm py-xxs rounded-pill text-caption-upper uppercase ${tones[tone]}`}
      variants={reduceMotion ? undefined : popIn}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.span>
  )
}

export function StatusChip({ status }: { status: 'reservado' | 'a_reservar' }) {
  return status === 'reservado' ? <Chip tone="success">Reservado</Chip> : <Chip tone="warning">A reservar</Chip>
}
