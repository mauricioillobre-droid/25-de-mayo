'use client'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import MedicalIcon from '@/components/MedicalIcon'
import { destacadas, waEspecialidad } from '@/lib/data'

const iconGradients = [
  'from-[#1E6BC6] to-[#56B4E9]',
  'from-[#0A2463] to-[#1E6BC6]',
  'from-[#56B4E9] to-[#1E6BC6]',
  'from-[#1E6BC6] to-[#0A2463]',
  'from-[#3B82F6] to-[#56B4E9]',
  'from-[#0A2463] to-[#3B82F6]',
  'from-[#1E6BC6] to-[#56B4E9]',
  'from-[#56B4E9] to-[#0A2463]',
]

const WhatsAppIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

export default function EspecialidadesDestacadas() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const shouldReduce = useReducedMotion()

  const spring = { type: 'spring' as const, stiffness: 65, damping: 18 }

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: shouldReduce ? 0 : 0.07,
        delayChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: shouldReduce ? {} : { opacity: 0, y: 36, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: spring,
    },
  }

  return (
    <section className="py-24 md:py-32 bg-[#F4F6F9] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #0A2463 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={spring}
          className="text-center mb-14"
        >
          <span className="inline-block text-[#1E6BC6] text-sm font-semibold uppercase tracking-widest mb-4">
            Especialidades
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0A2463] mb-5">
            Nuestras especialidades
          </h2>
          <p className="text-[#6B7280] text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Encontrá al especialista que necesitás, todo bajo un mismo techo.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {destacadas.map((esp) => (
            <motion.div
              key={esp.name}
              variants={item}
              whileHover={
                shouldReduce
                  ? {}
                  : {
                      y: -6,
                      transition: { type: 'spring', stiffness: 300, damping: 20 },
                    }
              }
              className="group relative bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center gap-4 shadow-sm hover:shadow-[0_12px_40px_rgba(30,107,198,0.14)] hover:border-[#1E6BC6]/20 transition-shadow duration-300 cursor-pointer"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center text-[#1E6BC6] transition-colors duration-250 group-hover:bg-[#1E6BC6] group-hover:text-white">
                <MedicalIcon type={esp.icon} className="w-8 h-8" />
              </div>

              {/* Name */}
              <p className="font-bold text-[#0A2463] text-sm leading-snug min-h-[2.5rem] flex items-center justify-center flex-1">
                {esp.name}
              </p>

              {/* WhatsApp button — always visible */}
              <a
                href={waEspecialidad(esp.name)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Sacar turno con ${esp.name}`}
                className="w-full flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1fba57] active:scale-[0.97] text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <WhatsAppIcon />
                Sacar turno
              </a>
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
