'use client'
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { WA_TURNO } from '@/lib/data'

const puntos = [
  {
    num: '01',
    titulo: 'Más de 35 especialidades',
    descripcion: 'Todo lo que necesitás en un solo lugar. Desde clínica médica hasta neurología infantil.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    num: '02',
    titulo: 'Fácil acceso',
    descripcion: 'En el corazón de Los Polvorines con rampa de acceso. Fácil estacionamiento en la zona.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    num: '03',
    titulo: 'Atención personalizada',
    descripcion: 'Profesionales comprometidos con tu salud. Tratamos a cada paciente con calidez y dedicación.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    num: '04',
    titulo: 'Turno online 24hs',
    descripcion: 'Escribinos por WhatsApp cuando quieras. Respondemos a la brevedad en horario de atención.',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
  },
]

export default function PorQueElegirnos() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const shouldReduce = useReducedMotion()

  const spring = { type: 'spring' as const, stiffness: 65, damping: 18 }

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: shouldReduce ? 0 : 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: shouldReduce ? {} : { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: spring },
  }

  return (
    <section className="relative py-24 md:py-36 bg-[#0A2463] overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, #56B4E9 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Gradient overlays */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1E6BC6]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#56B4E9]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={spring}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#56B4E9] text-sm font-semibold uppercase tracking-widest mb-4">
            Por qué elegirnos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
            Todo lo que necesitás,{' '}
            <br className="hidden md:block" />
            <span
              style={{
                background: 'linear-gradient(135deg, #56B4E9 0%, #93C5FD 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              en un solo lugar
            </span>
          </h2>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14"
        >
          {puntos.map((p) => (
            <motion.div
              key={p.titulo}
              variants={item}
              whileHover={
                shouldReduce
                  ? {}
                  : {
                      y: -4,
                      transition: { type: 'spring', stiffness: 300, damping: 20 },
                    }
              }
              className="relative bg-white/8 border border-white/10 rounded-2xl p-7 backdrop-blur-sm hover:bg-white/12 hover:border-[#56B4E9]/30 transition-all duration-300 group overflow-hidden"
            >
              {/* Decorative number */}
              <span className="absolute top-4 right-5 text-white/5 text-7xl font-black leading-none select-none pointer-events-none">
                {p.num}
              </span>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#56B4E9]/30 to-[#1E6BC6]/30 border border-[#56B4E9]/20 flex items-center justify-center text-[#56B4E9] mb-5 group-hover:from-[#56B4E9]/40 group-hover:to-[#1E6BC6]/40 transition-all duration-300">
                {p.icon}
              </div>

              {/* Accent line */}
              <div className="w-8 h-0.5 bg-gradient-to-r from-[#56B4E9] to-transparent mb-4" />

              <h3 className="text-white font-bold text-lg leading-snug mb-3">{p.titulo}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{p.descripcion}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.4 }}
          className="text-center"
        >
          <a
            href={WA_TURNO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1fba57] active:scale-[0.98] text-white font-bold px-8 py-4 rounded-full shadow-[0_8px_32px_rgba(37,211,102,0.3)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.4)] transition-all duration-200 text-[15px] cursor-pointer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Sacar turno por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}
