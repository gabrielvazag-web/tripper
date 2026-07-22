import type { Transition, Variants } from 'framer-motion'

/**
 * Presets de microinteração centralizados.
 * Ajuste aqui uma vez e todos os componentes que usam esses presets acompanham.
 */

// Durações (em segundos)
export const duration = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
} as const

// Easings — curva padrão de UI (ease-out suave) e spring para feedback tátil
export const ease = {
  out: [0.22, 1, 0.36, 1] as const, // "ease-out" com leve overshoot controlado
  inOut: [0.65, 0, 0.35, 1] as const,
}

export const spring = {
  soft: { type: 'spring', stiffness: 300, damping: 24 } as Transition,
  snappy: { type: 'spring', stiffness: 500, damping: 30 } as Transition,
}

// Feedback de toque/clique — usar em whileTap / whileHover
export const tap = { scale: 0.96 }
export const hoverLift = { scale: 1.02 }

// Entrada com fade + slide de baixo para cima
export const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.out },
  },
}

// Fade simples
export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.base, ease: ease.out } },
}

// Container que revela os filhos em sequência (stagger)
export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
})

// Pop com spring — bom para ícones/estados (ex.: check do checkbox)
export const popIn: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: spring.snappy },
}

// Backdrop (overlay escuro) — fade
export const backdrop: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.base, ease: ease.out } },
}

// Bottom sheet — desliza de baixo
export const sheet: Variants = {
  hidden: { y: '100%' },
  show: { y: 0, transition: { duration: duration.base, ease: ease.out } },
  exit: { y: '100%', transition: { duration: duration.fast, ease: ease.inOut } },
}

// Expand/collapse de altura (accordion)
export const collapse: Variants = {
  hidden: { height: 0, opacity: 0 },
  show: {
    height: 'auto',
    opacity: 1,
    transition: { height: { duration: duration.base, ease: ease.out }, opacity: { duration: duration.fast } },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { height: { duration: duration.fast, ease: ease.inOut }, opacity: { duration: duration.fast } },
  },
}
