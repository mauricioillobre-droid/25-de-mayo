'use client'
import React from 'react'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { practicasDestacadas } from '@/lib/data'

const icons: Record<string, React.ReactNode> = {
  'Electrocardiograma': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" d="M2 12h4l2-6 4 12 3-8 2 4h5" />
    </svg>
  ),
  'Ecocardiograma Doppler': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l7.78 7.78 7.78-7.78a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  'Ecografía y Doppler': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
    </svg>
  ),
  'Espirometrías': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" d="M6 12H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2 4 4 0 0 0 4-4V4a2 2 0 1 1 4 0v11M18 12h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 4 4 0 0 1-4-4V4a2 2 0 1 0-4 0v11" />
    </svg>
  ),
  'Electroencefalograma de sueño': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.26ZM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.26Z" />
    </svg>
  ),
  'Papanicolau y colposcopía': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
    </svg>
  ),
}

export default function PracticasDestacadas() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const shouldReduce = useReducedMotion()

  const spring = { type: 'spring' as const, stiffness: 65, damping: 18 }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: shouldReduce ? 0 : 0.08, delayChildren: 0.05 } },
  }
  const item = {
    hidden: shouldReduce ? {} : { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: spring },
  }

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={spring}
          className="text-center mb-14"
        >
          <span className="inline-block text-[#1E6BC6] text-sm font-semibold uppercase tracking-widest mb-4">
            Estudios y procedimientos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0A2463] mb-5">
            Prácticas y estudios
          </h2>
          <p className="text-[#6B7280] text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Realizamos estudios y procedimientos sin que tengas que ir a otro lado.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {practicasDestacadas.map((practica) => (
            <motion.div
              key={practica}
              variants={item}
              whileHover={
                shouldReduce
                  ? {}
                  : {
                      x: 4,
                      transition: { type: 'spring', stiffness: 400, damping: 20 },
                    }
              }
              className="group flex items-center gap-4 bg-[#F4F6F9] hover:bg-gradient-to-r hover:from-[#F0F7FF] hover:to-[#F4F6F9] border border-transparent hover:border-[#1E6BC6]/15 rounded-xl p-5 transition-all duration-250 cursor-default"
            >
              <div className="shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#1E6BC6] shadow-sm group-hover:shadow-md group-hover:text-[#0A2463] transition-all duration-250">
                {icons[practica] ?? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#0A2463] text-sm md:text-base leading-snug">{practica}</p>
              </div>
              <svg
                className="w-4 h-4 text-[#1E6BC6]/40 group-hover:text-[#1E6BC6] group-hover:translate-x-1 transition-all duration-200 shrink-0"
                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/practicas"
            className="inline-flex items-center gap-2 text-[#1E6BC6] font-bold hover:text-[#0A2463] transition-colors duration-200 cursor-pointer group"
          >
            Ver todas las prácticas
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
