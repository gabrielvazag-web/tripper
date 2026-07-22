import { useEffect, useRef } from 'react'
import { animate, useReducedMotion } from 'framer-motion'
import { duration, ease } from '../../lib/motion'

/** Anima a transição entre valores numéricos (ex.: totais em R$) sem re-render por frame. */
export function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(value)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (reduceMotion || prev.current === value) {
      node.textContent = format(value)
      prev.current = value
      return
    }

    const controls = animate(prev.current, value, {
      duration: duration.slow,
      ease: ease.out,
      onUpdate: (latest) => {
        node.textContent = format(latest)
      },
      onComplete: () => {
        prev.current = value
      },
    })

    return () => controls.stop()
  }, [value, format, reduceMotion])

  return <span ref={ref}>{format(value)}</span>
}
