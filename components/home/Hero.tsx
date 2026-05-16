'use client'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import ImageWithFallback from '@/components/ImageWithFallback'
import { WA_TURNO } from '@/lib/data'

const WhatsAppIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4 text-[#1E6BC6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
    initial: shouldReduce ? {} : { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    transition: shouldReduce
      ? {}
      : { type: 'spring' as const, stiffness: 70, damping: 18, delay },
  })

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-20">
      {/* Rich layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F0F7FF] via-white to-[#F4F6F9]" />
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1E6BC6]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#56B4E9]/8 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-[#0A2463]/3 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Text column */}
          <div className="relative">
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex items-center gap-2 bg-[#1E6BC6]/10 border border-[#1E6BC6]/20 text-[#1E6BC6] text-xs font-semibold px-4 py-2 rounded-full mb-8 tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E6BC6] animate-pulse" />
                Los Polvorines, Malvinas Argentinas
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.08)}
              className="text-5xl sm:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-black text-[#0A2463] leading-[1.05] tracking-tight mb-6"
            >
              Tu salud,{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #1E6BC6 0%, #56B4E9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                cerca de casa
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.16)}
              className="text-[#6B7280] text-lg md:text-xl leading-relaxed mb-10 max-w-[520px]"
            >
              Más de{' '}
              <strong className="text-[#0A2463] font-semibold">35 especialidades médicas</strong>{' '}
              en Los Polvorines. Sacá tu turno fácil y rápido, sin filas.
            </motion.p>

            <motion.div {...fadeUp(0.24)} className="flex flex-col sm:flex-row gap-3 mb-12">
              <a
                href={WA_TURNO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1fba57] active:scale-[0.98] text-white font-bold px-7 py-4 rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.45)] transition-all duration-200 text-[15px] cursor-pointer"
              >
                <WhatsAppIcon />
                Sacar turno por WhatsApp
              </a>
              <Link
                href="/especialidades"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#1E6BC6] text-[#1E6BC6] hover:bg-[#1E6BC6] hover:text-white font-bold px-7 py-4 rounded-full transition-all duration-200 text-[15px] cursor-pointer"
              >
                Ver especialidades
              </Link>
            </motion.div>

            {/* Trust signals strip */}
            <motion.div
              {...fadeUp(0.32)}
              className="flex flex-wrap gap-x-5 gap-y-2"
            >
              {trustSignals.map((s) => (
                <span key={s} className="flex items-center gap-1.5 text-[#6B7280] text-sm">
                  <CheckIcon />
                  {s}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Image column */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: 48, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={
              shouldReduce
                ? {}
                : { type: 'spring', stiffness: 60, damping: 20, delay: 0.1 }
            }
            className="relative"
          >
            {/* Decorative frame behind image */}
            <div className="absolute -inset-3 bg-gradient-to-br from-[#1E6BC6]/15 to-[#56B4E9]/10 rounded-[28px] blur-sm" />
            <div className="relative h-72 sm:h-[420px] lg:h-[520px] rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(10,36,99,0.18)]">
              <ImageWithFallback
                src="/images/exterior.jpeg"
                alt="Exterior del centro médico 25 de Mayo"
                fill
                className="object-cover"
                priority
                style={{ filter: 'brightness(1.05) contrast(1.1) saturate(1.15)' }}
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463]/25 via-transparent to-transparent" />

              {/* Floating badge */}
              <motion.div
                initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={shouldReduce ? {} : { delay: 0.5, type: 'spring', stiffness: 80 }}
                className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-[#1E6BC6]/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#1E6BC6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#0A2463] font-bold text-sm">Centro médico de confianza</p>
                  <p className="text-[#6B7280] text-xs">Atención personalizada desde 2020</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
