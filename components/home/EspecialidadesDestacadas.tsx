'use client'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import MedicalIcon from '@/components/MedicalIcon'
import { destacadas, practicas, waEspecialidad } from '@/lib/data'

/** Count practices associated with a specialty name */
function getPracticasCount(espName: string): number {
  const norm = espName.toLowerCase()
  for (const cat of practicas) {
    if (norm.includes(cat.categoria.toLowerCase()) ||
        cat.categoria.toLowerCase().includes(norm.split(' ')[0])) {
      return cat.items.length
    }
  }
  return 0
}

export default function EspecialidadesDestacadas() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const shouldReduce = useReducedMotion()

  const spring = { type: 'spring' as const, stiffness: 65, damping: 18 }

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: shouldReduce ? 0 : 0.08, delayChildren: 0.05 },
    },
  }
  const item = {
    hidden: shouldReduce ? {} : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: spring },
  }

  return (
    <section className="py-24 md:py-32 bg-[#F4F6F9] relative overflow-hidden">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #0A2463 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={spring}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#1E6BC6] text-xs font-bold uppercase tracking-widest mb-4">
            Especialidades médicas
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0A2463] mb-5">
            Nuestras especialidades
          </h2>
          <p className="text-[#6B7280] text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Encontrá al especialista que necesitás, todo bajo un mismo techo.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {destacadas.map((esp) => {
            const count = getPracticasCount(esp.name)
            return (
              <motion.div
                key={esp.name}
                variants={item}
                whileHover={shouldReduce ? {} : { scale: 1.02, transition: { duration: 0.2 } }}
                className="group bg-white border border-gray-100 hover:border-[#0A2463] rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-[0_12px_40px_rgba(10,36,99,0.12)] transition-all duration-200 cursor-pointer"
              >
                {/* Icon */}
                <div
                  className="w-[52px] h-[52px] flex items-center justify-center text-white shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #1a4a7a 0%, #2563eb 100%)',
                    borderRadius: '14px',
                  }}
                >
                  <MedicalIcon type={esp.icon} size={24} />
                </div>

                {/* Name + badge row */}
                <div className="flex-1">
                  <p className="font-bold text-[#0A2463] text-[15px] leading-snug mb-2">
                    {esp.name}
                  </p>
                  {count > 0 && (
                    <span className="inline-block text-[10px] font-semibold text-[#1E6BC6] bg-[#EFF6FF] px-2.5 py-1 rounded-full">
                      {count} práctica{count !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Subtle CTA */}
                <a
                  href={waEspecialidad(esp.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Sacar turno con ${esp.name}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-[#0A2463] text-sm font-semibold hover:text-[#1E6BC6] transition-colors duration-150 cursor-pointer w-fit"
                >
                  Ver turnos
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.2 }}
          className="text-center mt-14"
        >
          <Link
            href="/especialidades"
            className="inline-flex items-center gap-2 bg-white border-2 border-[#1E6BC6] text-[#1E6BC6] hover:bg-[#1E6BC6] hover:text-white font-bold px-8 py-3.5 rounded-full shadow-sm transition-all duration-200 cursor-pointer"
          >
            Ver todas las especialidades
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
