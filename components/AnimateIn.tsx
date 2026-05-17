'use client'
import { motion, useReducedMotion } from 'motion/react'

type Direction = 'left' | 'right' | 'up' | 'fade'

interface AnimateInProps {
  children: React.ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  className?: string
}

export default function AnimateIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className,
}: AnimateInProps) {
  const shouldReduce = useReducedMotion()

  // When reduced motion is active: only fade, no spatial movement
  const initial = shouldReduce
    ? { opacity: 0 }
    : {
        opacity: 0,
        x: direction === 'left' ? -40 : direction === 'right' ? 40 : 0,
        y: direction === 'up' ? 30 : 0,
      }

  const animate = shouldReduce
    ? { opacity: 1 }
    : { opacity: 1, x: 0, y: 0 }

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
