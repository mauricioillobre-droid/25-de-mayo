'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { WA_TURNO } from '@/lib/data'

const WhatsAppIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

const trustSignals = [
  'Fundados en 2020',
  'Más de 35 especialidades',
  'Rampa de acceso',
  'Turnos por WhatsApp 24hs',
]

export default function Hero() {
  const shouldReduce = useReducedMotion()

  const fadeUp = (delay: number) => ({
    initial: shouldReduce ? {} : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: shouldReduce
      ? {}
      : { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as const, delay },
  })

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

      {/* Dark overlay #0f2a4a at 50% */}
      <div className="absolute inset-0 bg-[#0f2a4a]/50" />

      {/* Subtle bottom gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f2a4a]/40 via-transparent to-transparent pointer-events-none" />

      {/* Location badge — anchored bottom-right, clear of the sign */}
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

      {/* Content — full width, left aligned */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-20 md:pt-56 md:pb-24">
        <div className="max-w-2xl xl:max-w-3xl">

          {/* Heading */}
          <motion.h1
            {...fadeUp(0.1)}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
          >
            Tu salud,{' '}
            <span className="text-[#56B4E9]">cerca de casa</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.2)}
            className="text-white/80 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
          >
            Más de{' '}
            <strong className="text-white font-semibold">35 especialidades médicas</strong>{' '}
            en Los Polvorines. Sacá tu turno fácil y rápido, sin filas.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-3 mb-12">
            <a
              href={WA_TURNO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1fba57] active:scale-[0.98] text-white font-bold px-7 py-4 rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.5)] transition-all duration-200 text-[15px] cursor-pointer"
            >
              <WhatsAppIcon />
              Sacar turno por WhatsApp
            </a>
            <Link
              href="/especialidades"
              className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 hover:bg-white/25 text-white font-bold px-7 py-4 rounded-full transition-all duration-200 text-[15px] cursor-pointer"
            >
              Ver especialidades
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            {...fadeUp(0.4)}
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            {trustSignals.map((s) => (
              <span key={s} className="flex items-center gap-1.5 text-white/75 text-sm">
                <svg className="w-4 h-4 text-[#56B4E9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {s}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
