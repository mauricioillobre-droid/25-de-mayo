'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import AnimateIn from '@/components/AnimateIn'

const trustSignals = [
  'Fundados en 2020',
  'Más de 35 especialidades',
  'Rampa de acceso',
  'Turnos por WhatsApp 24hs',
]

export default function Hero() {
  const shouldReduce = useReducedMotion()

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Full-bleed background image */}
      <Image
        src="/images/exterior.jpeg"
        alt="Exterior del centro médico 25 de Mayo"
        fill
        className="object-cover"
        style={{ objectPosition: 'center 20%' }}
        priority
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0f2a4a]/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f2a4a]/40 via-transparent to-transparent pointer-events-none" />

      {/* Location badge — absolute bottom-right */}
      <motion.div
        initial={shouldReduce ? {} : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
        className="absolute bottom-8 right-8 z-10"
      >
        <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-[11px] font-semibold px-4 py-2 rounded-full tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#56B4E9] animate-pulse shrink-0" />
          Los Polvorines, Malvinas Argentinas
        </span>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-20 md:pt-56 md:pb-24">
        <div className="max-w-2xl xl:max-w-3xl">

          <AnimateIn direction="left">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
              Tu salud,{' '}
              <span className="text-[#56B4E9]">cerca de casa</span>
            </h1>
          </AnimateIn>

          <AnimateIn direction="up" delay={0.1}>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Más de 35 especialidades médicas a minutos de tu casa.
              Atención de calidad, profesionales comprometidos y turnos sin esperas.
            </p>
          </AnimateIn>

          <AnimateIn direction="up" delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link
                href="/sacar-turno"
                className="inline-flex items-center justify-center gap-2.5 bg-[#0A2463] hover:bg-[#1756b8] active:scale-[0.98] text-white font-bold px-7 py-4 rounded-full shadow-[0_8px_24px_rgba(10,36,99,0.4)] hover:shadow-[0_12px_32px_rgba(10,36,99,0.5)] transition-all duration-200 text-[15px] cursor-pointer"
              >
                Sacar turno online
              </Link>
              <Link
                href="/especialidades"
                className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 hover:bg-white/25 text-white font-bold px-7 py-4 rounded-full transition-all duration-200 text-[15px] cursor-pointer"
              >
                Ver especialidades
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </AnimateIn>

          <AnimateIn direction="up" delay={0.3}>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {trustSignals.map((s) => (
                <span key={s} className="flex items-center gap-1.5 text-white/75 text-sm">
                  <svg className="w-4 h-4 text-[#56B4E9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {s}
                </span>
              ))}
            </div>
          </AnimateIn>

        </div>
      </div>
    </section>
  )
}
