import type { HTMLAttributes, ReactNode } from 'react'
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import { fadeSlideUp, staggerContainer } from '../../lib/motion'

type ListProps = Omit<HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'> & {
  children: ReactNode
  stagger?: number
}

/** Revela os filhos (StaggerItem) em sequência ao montar. Não reanima em updates. */
export function StaggerList({ children, stagger = 0.06, className = '', ...rest }: ListProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger)}
      initial="hidden"
      animate="show"
      {...(rest as HTMLMotionProps<'div'>)}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeSlideUp}>
      {children}
    </motion.div>
  )
}
