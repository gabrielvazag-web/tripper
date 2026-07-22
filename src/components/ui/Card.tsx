import type { HTMLAttributes } from 'react'
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import { fadeSlideUp } from '../../lib/motion'

type Props = Omit<
  HTMLAttributes<HTMLDivElement>,
  'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> & {
  padded?: boolean
  /** Anima a entrada do card (fade + slide de baixo para cima). */
  reveal?: boolean
}

export function Card({ padded = true, reveal = false, className = '', children, ...rest }: Props) {
  const reduceMotion = useReducedMotion()
  const classes = `bg-surface-card border border-hairline rounded-xl dark:bg-surface-dark-elevated dark:border-hairline-dark ${padded ? 'p-lg' : ''} ${className}`

  if (!reveal || reduceMotion) {
    return (
      <div className={classes} {...rest}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={classes}
      variants={fadeSlideUp}
      initial="hidden"
      animate="show"
      {...(rest as HTMLMotionProps<'div'>)}
    >
      {children}
    </motion.div>
  )
}
